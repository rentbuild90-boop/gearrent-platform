"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export function DataTable({ columns = [], data = [], title = "Data" }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Very basic local filtering
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(
      val => String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleExport = () => {
    toast.success(`Exporting ${filteredData.length} rows to CSV...`);
  };

  return (
    <Card className="border-border shadow-sm overflow-hidden flex flex-col h-full bg-card">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => toast.info("Filters opened")}>
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index} className="whitespace-nowrap font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                    {col.header}
                    {col.sortable !== false && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className="whitespace-nowrap">
                      {col.cell ? col.cell(row) : row[col.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No results found for "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10 text-sm">
        <div className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredData.length > 0 ? 1 : 0}</span> to <span className="font-medium text-foreground">{filteredData.length > 10 ? 10 : filteredData.length}</span> of <span className="font-medium text-foreground">{filteredData.length}</span> entries
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
