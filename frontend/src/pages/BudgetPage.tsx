import React, { useState, useEffect } from 'react';
import { Wallet, Users, Plus, Trash2, Calculator, RotateCcw, ChevronDown, PiggyBank } from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  category: string;
}

interface Friend {
  id: string;
  name: string;
}

const EXPENSE_CATEGORIES = [
  { id: 'food', label: '🍕 Food', color: 'text-amber-400' },
  { id: 'transport', label: '🚗 Transport', color: 'text-blue-400' },
  { id: 'activities', label: '🎮 Activities', color: 'text-purple-400' },
  { id: 'shopping', label: '🛍️ Shopping', color: 'text-pink-400' },
  { id: 'other', label: '📦 Other', color: 'text-slate-400' },
];

export const BudgetPage: React.FC = () => {
  // Fresh/new users start with ₹0 budget until they configure it
  const [totalBudget, setTotalBudget] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('twy_total_budget');
      if (stored !== null) return Number(stored) || 0;
    } catch {}
    return 0;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const stored = localStorage.getItem('twy_budget_friends');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [{ id: 'f1', name: 'You' }];
  });

  const [newFriendName, setNewFriendName] = useState('');
  
  // Expenses start empty for new accounts
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem('twy_budget_expenses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: 'f1',
    category: 'food',
  });
  const [splitResult, setSplitResult] = useState<Record<string, number> | null>(null);
  const [activeSection, setActiveSection] = useState<'budget' | 'expenses' | 'split'>('budget');

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const remaining = totalBudget > 0 ? totalBudget - totalSpent : 0;
  const spentPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  // Persist budget updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('twy_total_budget', String(totalBudget));
      localStorage.setItem('twy_budget_friends', JSON.stringify(friends));
      localStorage.setItem('twy_budget_expenses', JSON.stringify(expenses));
      const saved = totalBudget > 0 ? Math.max(0, totalBudget - totalSpent) : 0;
      localStorage.setItem('twy_budget_saved', String(saved));
    } catch {}
  }, [totalBudget, friends, expenses, totalSpent]);

  const addFriend = () => {
    if (!newFriendName.trim()) return;
    setFriends((prev) => [...prev, { id: `f${Date.now()}`, name: newFriendName.trim() }]);
    setNewFriendName('');
  };

  const removeFriend = (id: string) => {
    if (friends.length <= 1) return;
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setExpenses((prev) => prev.map((e) => ({ ...e, paidBy: e.paidBy === id ? friends[0].id : e.paidBy })));
  };

  const addExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount) return;
    setExpenses((prev) => [
      ...prev,
      {
        id: `e${Date.now()}`,
        description: newExpense.description,
        amount: Number(newExpense.amount),
        paidBy: newExpense.paidBy,
        category: newExpense.category,
      },
    ]);
    setNewExpense({ description: '', amount: '', paidBy: 'f1', category: 'food' });
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    setSplitResult(null);
  };

  const calculateSplit = () => {
    if (expenses.length === 0 || friends.length === 0) return;

    const perPerson = totalSpent / friends.length;
    const paid: Record<string, number> = {};
    const owed: Record<string, number> = {};

    friends.forEach((f) => {
      paid[f.id] = 0;
      owed[f.id] = perPerson;
    });

    expenses.forEach((e) => {
      paid[e.paidBy] = (paid[e.paidBy] || 0) + e.amount;
    });

    // Net = owed - paid (positive = owes, negative = is owed)
    const net: Record<string, number> = {};
    friends.forEach((f) => {
      net[f.id] = owed[f.id] - paid[f.id];
    });

    setSplitResult(net);
    setActiveSection('split');
  };

  const categoryBreakdown = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0),
  }));

  return (
    <div className="min-h-screen py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
          <PiggyBank className="w-3.5 h-3.5" />
          <span>Budget Guardian & Group Splitter</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
          Trip Budget Tracker
        </h1>
        <p className="text-slate-400 text-sm">No more awkward money moments. Track, split, and settle group expenses instantly.</p>
      </div>

      {/* Section Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 mb-6">
        {[
          { id: 'budget', label: '💰 Budget', desc: 'Set & Track' },
          { id: 'expenses', label: '📝 Expenses', desc: `${expenses.length} items` },
          { id: 'split', label: '🧮 Split', desc: 'Settle Up' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === tab.id
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-normal mt-0.5 ${activeSection === tab.id ? 'text-slate-950/70' : 'text-slate-600'}`}>
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* ── BUDGET SECTION ────────────────────────────────────────────── */}
      {activeSection === 'budget' && (
        <div className="space-y-5">
          {/* Budget Input */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Total Group Budget</h2>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-extrabold text-emerald-400">₹</span>
              <input
                type="number"
                value={totalBudget === 0 ? '' : totalBudget}
                placeholder="0"
                onChange={(e) => setTotalBudget(Math.max(0, Number(e.target.value) || 0))}
                className="text-3xl font-extrabold bg-transparent text-white outline-none w-36"
                min={0}
                step={50}
              />
            </div>
            <div className="text-xs text-slate-400 mb-3">
              ₹{friends.length > 0 && totalBudget > 0 ? Math.floor(totalBudget / friends.length) : 0} per person • {friends.length} {friends.length === 1 ? 'person' : 'people'}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Spent: <span className="text-white font-semibold">₹{totalSpent}</span></span>
                <span className={remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {remaining >= 0 ? `₹${remaining} left` : `₹${Math.abs(remaining)} over budget!`}
                </span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    spentPercent >= 90 ? 'bg-red-500' : spentPercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">{spentPercent.toFixed(0)}% of budget used</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-sm w-28 flex-shrink-0">{cat.label}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500/60 transition-all"
                      style={{ width: totalSpent > 0 ? `${(cat.total / totalSpent) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className={`text-xs font-semibold w-16 text-right ${cat.color}`}>
                    ₹{cat.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Friends Management */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Your Group ({friends.length})</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {friends.map((f) => (
                <div key={f.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-xs font-medium text-white">{f.name}</span>
                  {friends.length > 1 && (
                    <button onClick={() => removeFriend(f.id)} className="text-slate-500 hover:text-red-400 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addFriend(); }}
                placeholder="Add friend name..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none"
              />
              <button
                onClick={addFriend}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPENSES SECTION ──────────────────────────────────────────── */}
      {activeSection === 'expenses' && (
        <div className="space-y-5">
          {/* Add Expense */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">➕ Add Expense</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense((p) => ({ ...p, description: e.target.value }))}
                placeholder="What did you spend on?"
                className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-lg">₹</span>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="Amount"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none"
                  min={0}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <select
                value={newExpense.paidBy}
                onChange={(e) => setNewExpense((p) => ({ ...p, paidBy: e.target.value }))}
                className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white outline-none cursor-pointer"
              >
                {friends.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} paid</option>
                ))}
              </select>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense((p) => ({ ...p, category: e.target.value }))}
                className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white outline-none cursor-pointer"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addExpense}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Add Expense
            </button>
          </div>

          {/* Expense List */}
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-slate-800 border-dashed">
                <div className="text-3xl mb-2">🧾</div>
                <p className="text-slate-400 text-sm">No expenses yet. Add your first one!</p>
              </div>
            ) : (
              expenses.map((e) => {
                const cat = EXPENSE_CATEGORIES.find((c) => c.id === e.category);
                const paidByFriend = friends.find((f) => f.id === e.paidBy);
                return (
                  <div key={e.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{e.description}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className={cat?.color}>{cat?.label}</span>
                        {' • '}
                        <span>Paid by <strong className="text-slate-300">{paidByFriend?.name}</strong></span>
                      </div>
                    </div>
                    <div className="text-base font-bold text-emerald-400">₹{e.amount}</div>
                    <button
                      onClick={() => removeExpense(e.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {expenses.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Total Spent</div>
                <div className="text-xl font-extrabold text-white">₹{totalSpent}</div>
              </div>
              <button
                onClick={calculateSplit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg"
              >
                <Calculator className="w-4 h-4" />
                Split the Bill
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── SPLIT SECTION ─────────────────────────────────────────────── */}
      {activeSection === 'split' && (
        <div className="space-y-5">
          {splitResult ? (
            <>
              <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                <h3 className="text-sm font-bold text-white mb-1">💸 Who Owes What</h3>
                <p className="text-xs text-slate-400 mb-5">
                  Total: ₹{totalSpent} ÷ {friends.length} people = ₹{(totalSpent / friends.length).toFixed(0)} each
                </p>
                <div className="space-y-3">
                  {friends.map((f) => {
                    const net = splitResult[f.id] ?? 0;
                    const isOwing = net > 0;
                    const isOwed = net < 0;
                    return (
                      <div
                        key={f.id}
                        className={`p-4 rounded-2xl border ${
                          isOwing
                            ? 'bg-red-500/5 border-red-500/20'
                            : isOwed
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">{f.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              Paid: ₹{expenses.filter((e) => e.paidBy === f.id).reduce((s, e) => s + e.amount, 0)}
                            </div>
                          </div>
                          <div className={`text-right font-extrabold text-base ${isOwing ? 'text-red-400' : isOwed ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isOwing ? `Owes ₹${net.toFixed(0)}` : isOwed ? `Gets ₹${Math.abs(net).toFixed(0)}` : 'All Settled ✓'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => { setSplitResult(null); setActiveSection('expenses'); }}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Recalculate
              </button>
            </>
          ) : (
            <div className="text-center py-16 rounded-3xl border border-slate-800 border-dashed">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to Split?</h3>
              <p className="text-sm text-slate-400 mb-6">Add expenses first, then hit "Split the Bill" to see who owes who.</p>
              <button
                onClick={() => setActiveSection('expenses')}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Go to Expenses
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Fix: Add missing X import
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}
