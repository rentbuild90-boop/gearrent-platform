"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Database, Search, Edit3, Trash2, Plus, Terminal, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchWithCSRF } from "@/lib/api";

export default function DatabaseEditorPage() {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  // Find the primary key column name for the active table
  const getPrimaryKeyField = useCallback(() => {
    const pkCol = columns.find(c => c.primary_key);
    return pkCol ? pkCol.name : "id";
  }, [columns]);

  // Show status messages
  const triggerMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // Fetch all tables on load
  const loadTables = async () => {
    setLoadingTables(true);
    try {
      const res = await fetchWithCSRF("/api/developer/database/tables");
      const data = await res.json();
      if (res.ok && data.success) {
        setTables(data.tables || []);
        if (data.tables && data.tables.length > 0) {
          // Default to first table
          setActiveTable(data.tables[0]);
        }
      } else {
        triggerMessage("error", data.detail || "Failed to load database tables.");
      }
    } catch (err) {
      triggerMessage("error", "Error connecting to backend database explorer.");
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  // Fetch columns and records for active table
  const loadTableData = async (tableName) => {
    if (!tableName) return;
    setLoadingData(true);
    setSelectedRecord(null);
    setIsNewRecord(false);
    try {
      const res = await fetchWithCSRF(`/api/developer/database/tables/${tableName}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setColumns(data.columns || []);
        setRecords(data.records || []);
      } else {
        triggerMessage("error", data.detail || `Failed to fetch data for ${tableName}`);
      }
    } catch (err) {
      triggerMessage("error", `Network error loading table: ${tableName}`);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (activeTable) {
      loadTableData(activeTable);
    }
  }, [activeTable]);

  // Handle Edit Record click
  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setIsNewRecord(false);
    setJsonInput(JSON.stringify(record, null, 2));
  };

  // Handle New Record template initialization
  const handleNewRecordClick = () => {
    setIsNewRecord(true);
    const template = {};
    columns.forEach(col => {
      // Pre-populate with typical default types based on SQL column types
      if (col.primary_key) {
        // Skip or set null/default value
        if (col.type.toLowerCase().includes("int")) {
          template[col.name] = 0;
        } else {
          template[col.name] = "";
        }
      } else if (col.type.toLowerCase().includes("int") || col.type.toLowerCase().includes("decimal") || col.type.toLowerCase().includes("float")) {
        template[col.name] = 0;
      } else if (col.type.toLowerCase().includes("bool")) {
        template[col.name] = false;
      } else {
        template[col.name] = "";
      }
    });
    setSelectedRecord({});
    setJsonInput(JSON.stringify(template, null, 2));
  };

  // Save (Insert or Update) record
  const handleSaveRecord = async () => {
    setActionLoading(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const pkField = getPrimaryKeyField();

      if (isNewRecord) {
        // Insert payload
        const res = await fetchWithCSRF(`/api/developer/database/tables/${activeTable}/insert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          triggerMessage("success", "Record inserted successfully!");
          setSelectedRecord(null);
          loadTableData(activeTable);
        } else {
          triggerMessage("error", data.detail || "Failed to insert record.");
        }
      } else {
        // Update payload
        const pkValue = selectedRecord[pkField];
        
        // Remove primary key from data updates to avoid SQL errors
        const updateData = { ...parsed };
        delete updateData[pkField];

        const payload = {
          primary_key_field: pkField,
          primary_key_value: pkValue,
          data: updateData
        };

        const res = await fetchWithCSRF(`/api/developer/database/tables/${activeTable}/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          triggerMessage("success", "Record updated successfully!");
          setSelectedRecord(null);
          loadTableData(activeTable);
        } else {
          triggerMessage("error", data.detail || "Failed to update record.");
        }
      }
    } catch (e) {
      triggerMessage("error", "Invalid JSON syntax. Correct errors before saving.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete record
  const handleDeleteRecord = async (record) => {
    const pkField = getPrimaryKeyField();
    const pkValue = record[pkField];
    if (!confirm(`Are you sure you want to delete this record (${pkField}: ${pkValue})? This action is permanent.`)) {
      return;
    }
    
    setActionLoading(true);
    try {
      const res = await fetchWithCSRF(`/api/developer/database/tables/${activeTable}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_key_field: pkField,
          primary_key_value: pkValue
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerMessage("success", "Record deleted successfully.");
        loadTableData(activeTable);
      } else {
        triggerMessage("error", data.detail || "Failed to delete record.");
      }
    } catch (err) {
      triggerMessage("error", "Error connecting to backend database manager.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter records based on search query matching any key/value representation
  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.entries(record).some(([k, v]) => 
      String(k).toLowerCase().includes(query) || String(v).toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#0a0d16] text-slate-300 font-sans">
      {/* Sidebar - Tables List */}
      <div className="w-[280px] bg-[#0d1222] border-r border-emerald-500/10 flex flex-col">
        <div className="p-6 border-b border-emerald-500/10 flex items-center justify-between">
          <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
            <Database className="w-4 h-4 text-emerald-400" /> Database Explorer
          </h1>
          <button 
            onClick={loadTables} 
            disabled={loadingTables}
            className="text-slate-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
            title="Refresh Table List"
          >
            <RefreshCw className={`w-4 h-4 ${loadingTables ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 font-mono">
            TABLES ({tables.length})
          </div>
          {loadingTables ? (
            <div className="text-xs text-slate-600 px-2 font-mono">Loading schema...</div>
          ) : tables.length === 0 ? (
            <div className="text-xs text-slate-600 px-2 font-mono">No tables discovered.</div>
          ) : (
            tables.map(tbl => (
              <button
                key={tbl}
                onClick={() => { setActiveTable(tbl); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-200 border ${
                  activeTable === tbl 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'text-slate-400 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                {tbl}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#070a13] overflow-hidden relative">
        
        {/* Floating status alert banner */}
        {message.text && (
          <div className={`absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold shadow-lg backdrop-blur-md transition-all duration-300 ${
            message.type === "success" 
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400" 
              : "bg-red-950/80 border-red-500/30 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {selectedRecord ? (
          /* JSON Code Editor View */
          <div className="flex-1 flex flex-col h-full p-6 space-y-4">
            <div className="flex justify-between items-center bg-[#0d1222] p-4 rounded-xl border border-emerald-500/10">
              <div>
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  {isNewRecord ? "INSERT NEW RECORD" : "EDIT RECORD"}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Table: <span className="text-emerald-500">{activeTable}</span>
                  {!isNewRecord && ` | PK: ${getPrimaryKeyField()} = ${selectedRecord[getPrimaryKeyField()]}`}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setSelectedRecord(null); setIsNewRecord(false); }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold font-mono border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleSaveRecord}
                  disabled={actionLoading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-colors shadow-md shadow-emerald-500/10 disabled:opacity-50"
                >
                  {actionLoading ? "SAVING..." : "COMMIT CHANGE"}
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-[#0b0f19] rounded-xl border border-emerald-500/10 overflow-hidden flex flex-col shadow-inner">
              <div className="bg-[#0f1524] px-4 py-2.5 border-b border-emerald-500/10 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-400">interactive_terminal.json</span>
              </div>
              <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="flex-1 w-full bg-transparent text-emerald-400 font-mono text-sm p-6 focus:outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>
          </div>
        ) : (
          /* Table Explorer View */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Search and Action Bar */}
            <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center bg-[#0d1222]">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${activeTable || "table"}...`}
                  className="w-full bg-[#070a13] text-white border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
              <button 
                onClick={handleNewRecordClick}
                disabled={!activeTable || loadingData}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/10"
              >
                <Plus className="w-4 h-4" /> INSERT RECORD
              </button>
            </div>

            {/* Records Table */}
            <div className="flex-1 overflow-auto">
              {loadingData ? (
                <div className="h-full flex flex-col justify-center items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <span className="text-xs font-mono text-slate-500">Querying database engine...</span>
                </div>
              ) : !activeTable ? (
                <div className="h-full flex flex-col justify-center items-center text-slate-500">
                  <Database className="w-12 h-12 text-slate-700 mb-2" />
                  <span className="text-sm font-mono">Select a table from the sidebar to inspect records.</span>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-slate-500">
                  <Terminal className="w-12 h-12 text-slate-700 mb-2" />
                  <span className="text-sm font-mono">No records found matching search parameters.</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-[#0c101c] border-b border-emerald-500/10 text-slate-400 font-semibold uppercase tracking-wider sticky top-0 z-10">
                      <th className="p-4 w-40">PK ({getPrimaryKeyField()})</th>
                      <th className="p-4">JSON Record Payload</th>
                      <th className="p-4 text-right w-36">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredRecords.map((record, index) => {
                      const pkField = getPrimaryKeyField();
                      const pkVal = record[pkField];
                      
                      // Create copy without primary key for displaying payload
                      const displayRecord = { ...record };
                      delete displayRecord[pkField];

                      return (
                        <tr key={index} className="hover:bg-slate-800/10 transition-colors">
                          <td className="p-4 font-bold text-emerald-400 whitespace-nowrap overflow-hidden text-ellipsis">
                            {pkVal}
                          </td>
                          <td className="p-4 text-slate-300 max-w-xl break-all">
                            <span className="text-slate-500 text-[10px] bg-slate-900/60 px-2 py-0.5 rounded mr-2 border border-slate-800">
                              JSON
                            </span>
                            {JSON.stringify(displayRecord)}
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex gap-2">
                              <button 
                                onClick={() => handleEditRecord(record)}
                                className="text-slate-400 hover:text-emerald-400 p-1.5 rounded bg-slate-800/20 hover:bg-slate-800 transition-all border border-transparent hover:border-emerald-500/20"
                                title="Edit Document"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteRecord(record)}
                                className="text-slate-400 hover:text-red-400 p-1.5 rounded bg-slate-800/20 hover:bg-slate-800 transition-all border border-transparent hover:border-red-500/20"
                                title="Delete Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
