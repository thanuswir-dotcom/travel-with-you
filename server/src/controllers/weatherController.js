import { getWeatherForCity } from '../services/weatherService.js';

export const getWeather = (req, res) => {
  const city = req.query.city || 'Bengaluru';
  const data = getWeatherForCity(city);
  res.json(data);
};
