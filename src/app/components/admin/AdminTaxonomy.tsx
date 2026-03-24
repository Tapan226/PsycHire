import React, { useState } from 'react';
import {
  Tag, Plus, X, Edit3, Trash2, Search, Check, Save,
  Briefcase, BookOpen, MapPin, GraduationCap, Layers, Star,
  ChevronDown, ChevronRight, AlertTriangle,
} from 'lucide-react';

/* ═══ Types ═══ */

interface TaxonomyItem {
  id: string;
  label: string;
  count: number;
  isNew?: boolean;
}

interface TaxonomyCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  items: TaxonomyItem[];
}

/* ═══ Mock Data ═══ */

const INITIAL_CATEGORIES: TaxonomyCategory[] = [
  {
    id: 'specializations',
    label: 'Specializations',
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    items: [
      { id: 's1', label: 'Clinical Psychology', count: 142 },
      { id: 's2', label: 'Counseling Psychology', count: 98 },
      { id: 's3', label: 'I/O Psychology', count: 76 },
      { id: 's4', label: 'Neuropsychology', count: 54 },
      { id: 's5', label: 'Child & Adolescent', count: 48 },
      { id: 's6', label: 'Health Psychology', count: 36 },
      { id: 's7', label: 'Forensic Psychology', count: 28 },
      { id: 's8', label: 'Educational Psychology', count: 24 },
      { id: 's9', label: 'Sports Psychology', count: 16 },
    ],
  },
  {
    id: 'skills',
    label: 'Skills & Competencies',
    icon: Layers,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    items: [
      { id: 'sk1', label: 'Cognitive Behavioral Therapy (CBT)', count: 186 },
      { id: 'sk2', label: 'Psychometric Assessment', count: 124 },
      { id: 'sk3', label: 'Research Methods', count: 98 },
      { id: 'sk4', label: 'SPSS / R / Python', count: 72 },
      { id: 'sk5', label: 'Trauma-Informed Care', count: 68 },
      { id: 'sk6', label: 'Dialectical Behavior Therapy (DBT)', count: 56 },
      { id: 'sk7', label: 'Mindfulness-Based Interventions', count: 48 },
      { id: 'sk8', label: 'Crisis Intervention', count: 42 },
    ],
  },
  {
    id: 'job_types',
    label: 'Job Types',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    items: [
      { id: 'jt1', label: 'Full-time', count: 215 },
      { id: 'jt2', label: 'Part-time', count: 82 },
      { id: 'jt3', label: 'Contract', count: 56 },
      { id: 'jt4', label: 'Internship', count: 94 },
      { id: 'jt5', label: 'Fellowship', count: 34 },
      { id: 'jt6', label: 'Freelance', count: 28 },
    ],
  },
  {
    id: 'course_types',
    label: 'Course Types',
    icon: BookOpen,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    items: [
      { id: 'ct1', label: 'Certification', count: 42 },
      { id: 'ct2', label: 'Workshop', count: 68 },
      { id: 'ct3', label: 'Diploma', count: 24 },
      { id: 'ct4', label: 'Short Course', count: 56 },
      { id: 'ct5', label: 'Bootcamp', count: 18 },
      { id: 'ct6', label: 'Masterclass', count: 12 },
    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: MapPin,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    items: [
      { id: 'l1', label: 'Mumbai, MH', count: 156 },
      { id: 'l2', label: 'Delhi NCR', count: 134 },
      { id: 'l3', label: 'Bangalore, KA', count: 112 },
      { id: 'l4', label: 'Hyderabad, TS', count: 78 },
      { id: 'l5', label: 'Chennai, TN', count: 64 },
      { id: 'l6', label: 'Pune, MH', count: 52 },
      { id: 'l7', label: 'Kolkata, WB', count: 38 },
    ],
  },
  {
    id: 'career_stages',
    label: 'Career Stages',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    items: [
      { id: 'cs1', label: 'Student', count: 340 },
      { id: 'cs2', label: 'Entry Level (0–2 years)', count: 186 },
      { id: 'cs3', label: 'Mid Career (3–7 years)', count: 142 },
      { id: 'cs4', label: 'Senior (8–15 years)', count: 98 },
      { id: 'cs5', label: 'Leadership (15+ years)', count: 54 },
    ],
  },
];

/* ═══ Component ═══ */

export function AdminTaxonomy() {
  const [categories, setCategories] = useState<TaxonomyCategory[]>(INITIAL_CATEGORIES);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('specializations');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newItemValue, setNewItemValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCategory(prev => prev === id ? null : id);
    setAddingTo(null);
    setEditingItem(null);
  };

  const handleAddItem = (categoryId: string) => {
    if (!newItemValue.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        items: [...cat.items, { id: `new_${Date.now()}`, label: newItemValue.trim(), count: 0, isNew: true }],
      };
    }));
    setNewItemValue('');
    setAddingTo(null);
  };

  const handleEditItem = (categoryId: string, itemId: string) => {
    if (!editValue.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => item.id === itemId ? { ...item, label: editValue.trim() } : item),
      };
    }));
    setEditingItem(null);
    setEditValue('');
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
    }));
    setConfirmDelete(null);
  };

  const filteredCategories = searchQuery
    ? categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())),
      })).filter(cat => cat.items.length > 0)
    : categories;

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-brand-primary" />
          <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Taxonomy Manager</p>
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500" style={{ fontSize: 11, fontWeight: 600 }}>
            {totalItems} items across {categories.length} categories
          </span>
        </div>
        <div className="relative sm:ml-auto max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search taxonomy items..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
            style={{ fontSize: 13 }}
          />
        </div>
      </div>

      {/* ── Category Accordions ── */}
      <div className="flex flex-col gap-3">
        {filteredCategories.map(category => {
          const isExpanded = expandedCategory === category.id;
          return (
            <div key={category.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleExpand(category.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className={`w-9 h-9 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                  <category.icon size={16} className={category.color} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{category.label}</p>
                  <p className="text-gray-400" style={{ fontSize: 12 }}>{category.items.length} items</p>
                </div>
                {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
              </button>

              {/* Items */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-3">
                  <div className="flex flex-col gap-1">
                    {category.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 group">
                        {editingItem === item.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleEditItem(category.id, item.id)}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                              style={{ fontSize: 13 }}
                              autoFocus
                            />
                            <button
                              onClick={() => handleEditItem(category.id, item.id)}
                              className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => { setEditingItem(null); setEditValue(''); }}
                              className="w-7 h-7 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 text-gray-700" style={{ fontSize: 13 }}>
                              {item.label}
                              {item.isNew && (
                                <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600" style={{ fontSize: 9, fontWeight: 700 }}>NEW</span>
                              )}
                            </span>
                            <span className="text-gray-400 shrink-0" style={{ fontSize: 11 }}>{item.count} listings</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => { setEditingItem(item.id); setEditValue(item.label); }}
                                className="w-7 h-7 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={13} />
                              </button>
                              {confirmDelete === item.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDeleteItem(category.id, item.id)}
                                    className="px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    style={{ fontSize: 10, fontWeight: 700 }}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                                    style={{ fontSize: 10, fontWeight: 700 }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(item.id)}
                                  className="w-7 h-7 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Item */}
                  {addingTo === category.id ? (
                    <div className="flex items-center gap-2 mt-3 px-3">
                      <input
                        type="text"
                        value={newItemValue}
                        onChange={e => setNewItemValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddItem(category.id)}
                        placeholder={`Add new ${category.label.toLowerCase().replace(/s$/, '')}...`}
                        className="flex-1 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50/30 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        style={{ fontSize: 13 }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddItem(category.id)}
                        className="px-3 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => { setAddingTo(null); setNewItemValue(''); }}
                        className="px-3 py-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                        style={{ fontSize: 12, fontWeight: 600 }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTo(category.id)}
                      className="flex items-center gap-1.5 text-brand-primary hover:text-brand-primary/80 transition-colors mt-3 px-3 py-1"
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      <Plus size={14} />
                      Add Item
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Info Banner ── */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-blue-50 border border-blue-100">
        <AlertTriangle size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800" style={{ fontSize: 13, fontWeight: 700 }}>About Taxonomy Management</p>
          <p className="text-blue-600 mt-1" style={{ fontSize: 12, lineHeight: 1.5 }}>
            Changes to taxonomy items affect filter options across all modules. New items will appear in dropdown menus and filter chips immediately. Deleting items with existing listings will not remove those listings — they will retain their current tags.
          </p>
        </div>
      </div>
    </div>
  );
}
