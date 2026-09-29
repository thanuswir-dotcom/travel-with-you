import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, RotateCcw, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

const DEFAULT_PRESETS: Record<string, { label: string; icon: string; items: string[] }> = {
  beach: {
    label: 'Beach & Coast',
    icon: '🏖️',
    items: [
      'Sunscreen SPF 50+',
      'Polarized Sunglasses',
      'Waterproof phone pouch',
      'Spare t-shirt & shorts',
      'Quick-dry microfibre towel',
      'Flip-flops / Slippers',
      'High-capacity Power bank',
      'Drinking water bottle',
    ],
  },
  trek: {
    label: 'Hill & Trekking',
    icon: '⛰️',
    items: [
      'Comfortable grip trekking shoes',
      'Warm hoodie / Light jacket',
      'Mini First Aid kit & band-aids',
      'Rain poncho / Compact umbrella',
      'Electrolyte packets (ORS) & nuts',
      'Torch / LED Headlamp',
      'Trash bag (Leave No Trace!)',
      'Offline downloaded maps',
    ],
  },
  movie: {
    label: 'Movies & Malls',
    icon: '🎬',
    items: [
      'College ID card (Matinee student discount)',
      'Light jacket (Chilly AC auditorium)',
      'Metro Smart Card / Fastag',
      'UPI payment app with buffer balance',
      'Earphones for the transit commute',
      'Mint gum & mouth freshener',
    ],
  },
  temple: {
    label: 'Temple & Heritage',
    icon: '🛕',
    items: [
      'Traditional or modest dress attire',
      'Cotton socks (For scorching hot stone floors)',
      'Small shoulder bag for shoe counter tokens',
      'Coin change & ₹10-₹20 notes for offerings',
      'Wet wipes & sanitiser',
      'Camera or phone with full charge',
    ],
  },
  study: {
    label: 'Study Cafe Session',
    icon: '☕',
    items: [
      'Laptop & power brick charger',
      'Noise-cancelling headphones',
      'Spiral notebook & pens',
      'Sticky notes for group brainstorming',
      'Campus / Library ID card',
      'Reusable tumbler for coffee discounts',
    ],
  },
};

export const SquadChecklist: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('beach');
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem('twy_squad_checklist');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    // Default initial preset items
    return DEFAULT_PRESETS.beach.items.map((text, idx) => ({
      id: `init-${idx}`,
      text,
      checked: false,
      category: 'beach',
    }));
  });

  const [newItemText, setNewItemText] = useState('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('twy_squad_checklist', JSON.stringify(items));
    } catch {}
  }, [items]);

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    const preset = DEFAULT_PRESETS[key];
    if (!preset) return;
    const newItems: ChecklistItem[] = preset.items.map((text, idx) => ({
      id: `${key}-${idx}-${Date.now()}`,
      text,
      checked: false,
      category: key,
    }));
    setItems(newItems);
  };

  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      checked: false,
      category: selectedPreset,
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemText('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetChecklist = () => {
    handleSelectPreset(selectedPreset);
  };

  const handleShareChecklist = () => {
    const preset = DEFAULT_PRESETS[selectedPreset] || { label: 'Trip', icon: '🎒' };
    const checkedCount = items.filter((i) => i.checked).length;
    const lines = items
      .map((i) => `${i.checked ? '✅' : '⬜'} ${i.text}`)
      .join('\n');

    const text = `${preset.icon} *Squad Packing Checklist for ${preset.label}!*\n\n` +
      `📊 *Status:* ${checkedCount}/${items.length} items packed\n\n` +
      `${lines}\n\n` +
      `🎒 Organise your squad trips at: https://travel-with-you.vercel.app`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Preset Category Switcher */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(DEFAULT_PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => handleSelectPreset(key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedPreset === key
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Progress & Quick Actions Card */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Squad Packing Progress</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                {checkedCount} of {items.length} packed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Check off items as you pack so nobody forgets the essentials!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareChecklist}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              title="Share checklist on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handleResetChecklist}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom packing item (e.g. Uno Cards, Frisbee)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Items List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-slate-800/80 bg-slate-900/40 text-slate-400 text-xs">
            No items in this checklist. Pick a preset above or add custom items!
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                item.checked
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className={`text-xs font-medium ${item.checked ? 'line-through text-slate-500' : ''}`}>
                  {item.text}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
