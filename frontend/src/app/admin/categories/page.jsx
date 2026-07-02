"use client";

import React, { useState } from "react";
import { Tags, Plus, Search, Save, Edit2 } from "lucide-react";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");

  const [pricingItems, setPricingItems] = useState([
    { id: "CAT-01", type: "Category", name: "Excavators", basePrice: 5000, unit: "per day" },
    { id: "MOD-101", type: "Model", name: "CAT 320 Hydraulic Excavator", basePrice: 6500, unit: "per day" },
    { id: "CAT-02", type: "Category", name: "Cranes", basePrice: 12000, unit: "per day" },
    { id: "MOD-202", type: "Model", name: "Liebherr LTM 11200", basePrice: 25000, unit: "per day" },
    { id: "CAT-03", type: "Category", name: "Backhoe Loaders", basePrice: 3500, unit: "per day" },
    { id: "MOD-303", type: "Model", name: "JCB 3DX", basePrice: 4000, unit: "per day" },
  ]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    const newItem = {
      id: `CAT-0${pricingItems.length + 1}`,
      type: "Category",
      name: newCategoryName,
      basePrice: 0,
      unit: "per day"
    };
    setPricingItems([...pricingItems, newItem]);
    alert(`Category "${newCategoryName}" added successfully!`);
    setNewCategoryName("");
    setNewCategoryDesc("");
  };

  const handlePriceChange = (id, newPrice) => {
    setPricingItems(pricingItems.map(item => 
      item.id === id ? { ...item, basePrice: Number(newPrice) } : item
    ));
  };

  const handleSavePrice = (name) => {
    alert(`Pricing for ${name} updated successfully!`);
  };

  const filteredItems = pricingItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/20 p-3 rounded-xl">
          <Tags className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Vehicle Categories & Pricing</h1>
          <p className="text-outline text-sm">Add new categories and set base pricing for categories or specific models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Add Category Section */}
        <div className="xl:col-span-1">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <h2 className="text-lg font-bold text-on-background mb-4">Add Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-background mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Forklifts"
                  className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-background mb-1">Description</label>
                <textarea 
                  rows="3"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Optional description..."
                  className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </form>
          </div>
        </div>

        {/* Pricing Search & List Section */}
        <div className="xl:col-span-2">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories or specific vehicle models to set pricing..."
                  className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant text-sm font-semibold sticky top-0">
                    <th className="p-4">Type</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Base Price (₹)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-outline">No matches found for "{searchQuery}".</td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-outline-variant/30 hover:bg-surface-container/50 transition-colors group">
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.type === 'Category' ? 'bg-secondary/20 text-secondary' : 'bg-tertiary-container text-on-tertiary-container'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-semibold text-on-background">{item.name}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-outline font-medium">₹</span>
                            <input 
                              type="number"
                              value={item.basePrice}
                              onChange={(e) => handlePriceChange(item.id, e.target.value)}
                              className="w-24 bg-surface-container text-on-background border border-outline/30 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                            <span className="text-xs text-outline whitespace-nowrap">{item.unit}</span>
                          </div>
                        </td>
                        <td className="p-4 flex justify-end">
                          <button 
                            onClick={() => handleSavePrice(item.name)}
                            className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold"
                          >
                            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
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
  );
}
