"use client";

import React, { useState } from "react";
import { DollarSign, Save, Percent, TrendingUp, Search, Plus, Filter, Edit2, Tag } from "lucide-react";

export default function PricingSettingsPage() {
  // Global Settings
  const [baseCommission, setBaseCommission] = useState(15);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.2);
  const [surgeActive, setSurgeActive] = useState(false);

  // Categories & Models
  const categories = ["Excavators", "Cranes", "Backhoe Loaders", "Forklifts", "Dump Trucks"];
  const [selectedCategory, setSelectedCategory] = useState("Excavators");
  
  const [models, setModels] = useState([
    { id: "MOD-1", category: "Excavators", name: "CAT 320 Hydraulic", price: 6500, unit: "days", customUnit: "" },
    { id: "MOD-2", category: "Excavators", name: "Komatsu PC200", price: 6000, unit: "days", customUnit: "" },
    { id: "MOD-3", category: "Cranes", name: "Liebherr LTM 11200", price: 25000, unit: "days", customUnit: "" },
    { id: "MOD-4", category: "Cranes", name: "Terex RT 90", price: 15000, unit: "days", customUnit: "" },
    { id: "MOD-5", category: "Backhoe Loaders", name: "JCB 3DX", price: 500, unit: "hrs", customUnit: "" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // New Model Form State
  const [newModelName, setNewModelName] = useState("");
  const [newModelPrice, setNewModelPrice] = useState("");
  const [newModelUnit, setNewModelUnit] = useState("days");
  const [newModelCustomUnit, setNewModelCustomUnit] = useState("");

  const handleSaveGlobal = () => {
    alert("Global pricing settings saved successfully!");
  };

  const handleAddModel = (e) => {
    e.preventDefault();
    if (!newModelName || !newModelPrice) return;
    
    const newModel = {
      id: `MOD-${Date.now()}`,
      category: selectedCategory,
      name: newModelName,
      price: Number(newModelPrice),
      unit: newModelUnit,
      customUnit: newModelUnit === "custom" ? newModelCustomUnit : ""
    };
    
    setModels([...models, newModel]);
    alert(`Model "${newModelName}" added to ${selectedCategory} pricing list.`);
    setNewModelName("");
    setNewModelPrice("");
    setNewModelUnit("days");
    setNewModelCustomUnit("");
  };

  const handleUpdateModel = (id, field, value) => {
    setModels(models.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSaveModelPrice = (name) => {
    alert(`Pricing for ${name} updated successfully!`);
  };

  const filteredModels = models.filter(m => 
    m.category === selectedCategory && 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/20 p-3 rounded-xl">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Pricing Configuration</h1>
          <p className="text-outline text-sm">Manage global commission rates and detailed vehicle pricing models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Global Pricing Settings (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-on-background mb-4">Global Commission</h2>
              <label className="block text-sm font-semibold text-on-background mb-2">Base Platform Commission (%)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={baseCommission} 
                  onChange={(e) => setBaseCommission(e.target.value)}
                  className="bg-surface-container text-on-background border border-outline/30 rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Percent className="text-outline w-5 h-5" />
              </div>
              <p className="text-xs text-outline mt-2">Percentage deducted from owner payouts.</p>
            </div>

            <hr className="border-outline-variant/30" />

            <div>
              <h2 className="text-lg font-bold text-on-background mb-4">Dynamic Surge Pricing</h2>
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={() => setSurgeActive(!surgeActive)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    surgeActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {surgeActive ? 'Surge Active' : 'Surge Inactive'}
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-on-surface-variant w-32">Multiplier (x)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={surgeMultiplier} 
                  onChange={(e) => setSurgeMultiplier(e.target.value)}
                  disabled={!surgeActive}
                  className="bg-surface-container text-on-background border border-outline/30 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-outline-variant/30 mt-auto">
              <button 
                onClick={handleSaveGlobal}
                className="w-full bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" /> Save Global Settings
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Model Pricing (Right Column) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col min-h-[600px]">
            
            {/* Header & Category Selection */}
            <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest rounded-t-xl space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-on-background">Vehicle Model Pricing</h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Select Category</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Add New Model Form */}
            <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low/50">
              <h3 className="text-sm font-semibold text-on-background mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary"/> Add New Model to {selectedCategory}
              </h3>
              <form onSubmit={handleAddModel} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-outline mb-1">Model Name</label>
                  <input 
                    type="text" 
                    required
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="e.g. CAT 320"
                    className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-outline mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newModelPrice}
                    onChange={(e) => setNewModelPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-outline mb-1">Unit</label>
                  <select 
                    value={newModelUnit}
                    onChange={(e) => setNewModelUnit(e.target.value)}
                    className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="hrs">per Hour</option>
                    <option value="days">per Day</option>
                    <option value="months">per Month</option>
                    <option value="custom">Custom Format...</option>
                  </select>
                </div>
                {newModelUnit === "custom" && (
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-outline mb-1">Custom Unit</label>
                    <input 
                      type="text" 
                      required
                      value={newModelCustomUnit}
                      onChange={(e) => setNewModelCustomUnit(e.target.value)}
                      placeholder="e.g. per week"
                      className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}
                <div className={newModelUnit === "custom" ? "md:col-span-12 mt-2" : "md:col-span-3"}>
                  <button 
                    type="submit"
                    className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary transition-colors px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Model
                  </button>
                </div>
              </form>
            </div>

            {/* Model List & Search */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-outline-variant/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${selectedCategory} models...`}
                    className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant text-xs font-semibold uppercase tracking-wider sticky top-0 z-10">
                      <th className="p-4">Model Name</th>
                      <th className="p-4 w-32">Price (₹)</th>
                      <th className="p-4 w-40">Pricing Unit</th>
                      <th className="p-4 text-right w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModels.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-outline">No models found in this category.</td>
                      </tr>
                    ) : (
                      filteredModels.map((model) => (
                        <tr key={model.id} className="border-b border-outline-variant/30 hover:bg-surface-container/30 transition-colors">
                          <td className="p-4 text-sm font-semibold text-on-background">{model.name}</td>
                          <td className="p-4">
                            <input 
                              type="number"
                              value={model.price}
                              onChange={(e) => handleUpdateModel(model.id, 'price', e.target.value)}
                              className="w-full bg-surface-container text-on-background border border-outline/30 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                          </td>
                          <td className="p-4 space-y-2">
                            <select 
                              value={model.unit}
                              onChange={(e) => handleUpdateModel(model.id, 'unit', e.target.value)}
                              className="w-full bg-surface-container text-on-background border border-outline/30 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                            >
                              <option value="hrs">per Hour</option>
                              <option value="days">per Day</option>
                              <option value="months">per Month</option>
                              <option value="custom">Custom...</option>
                            </select>
                            {model.unit === "custom" && (
                              <input 
                                type="text"
                                value={model.customUnit}
                                onChange={(e) => handleUpdateModel(model.id, 'customUnit', e.target.value)}
                                placeholder="Custom unit"
                                className="w-full bg-surface-container text-on-background border border-outline/30 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                              />
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleSaveModelPrice(model.name)}
                              className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors flex items-center justify-center w-full"
                              title="Save changes"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
