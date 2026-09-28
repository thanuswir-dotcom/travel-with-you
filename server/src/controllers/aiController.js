import { generatePlan, chatWithAI, getSurprisePlace } from '../services/aiService.js';

export const planTrip = async (req, res, next) => {
  try {
    const { budget = 500, friends = 3, hours = 4, city = 'Bengaluru', preferences = [] } = req.body;
    const plan = await generatePlan({ budget, friends, hours, city, preferences });
    res.json(plan);
  } catch (err) {
    next(err);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { message = '', city = 'Bengaluru' } = req.body;
    const result = await chatWithAI({ message, city });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const surpriseMe = async (req, res, next) => {
  try {
    const { city = 'Bengaluru', budget = 300 } = req.body;
    const result = await getSurprisePlace({ city, budget });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
