import { readDB, writeDB } from '../services/dbService.js';

export const getExpenses = (req, res) => {
  const db = readDB();
  const tripId = req.query.tripId;
  const expenses = tripId ? db.expenses.filter(e => e.tripId === tripId) : db.expenses;
  res.json(expenses || []);
};

export const createExpense = (req, res) => {
  const db = readDB();
  const { tripId = 'trip-1', description, amount, paidBy, category } = req.body;

  const newExp = {
    id: `exp-${Date.now()}`,
    tripId,
    description: description || 'Food combo',
    amount: Number(amount) || 100,
    paidBy: paidBy || 'You',
    category: category || 'food',
    createdAt: new Date().toISOString()
  };

  db.expenses.push(newExp);
  writeDB(db);
  res.status(201).json(newExp);
};

export const splitExpenses = (req, res) => {
  const { friends = [], expenses = [] } = req.body;
  if (friends.length === 0 || expenses.length === 0) {
    return res.json({ perPerson: 0, settlements: [] });
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const perPerson = Math.round(total / friends.length);

  const paidMap = {};
  friends.forEach(f => { paidMap[f] = 0; });
  expenses.forEach(e => {
    paidMap[e.paidBy] = (paidMap[e.paidBy] || 0) + Number(e.amount);
  });

  const settlements = friends.map(f => {
    const paid = paidMap[f] || 0;
    const diff = paid - perPerson;
    return {
      friend: f,
      paid,
      share: perPerson,
      net: diff // positive = gets back, negative = owes
    };
  });

  res.json({
    total,
    perPerson,
    settlements
  });
};

export const deleteExpense = (req, res) => {
  const db = readDB();
  db.expenses = db.expenses.filter(e => e.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
};
