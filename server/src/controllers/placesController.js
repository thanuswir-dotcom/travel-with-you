import { readDB, writeDB } from '../services/dbService.js';

export const getPlaces = (req, res) => {
  const db = readDB();
  let places = [...db.places];
  const {
    city,
    category,
    search,
    maxCost,
    minRating,
    hasWifi,
    hasCharging,
    isOutdoor,
    isQuiet,
    isFree,
    sort
  } = req.query;

  // City filter
  if (city && city !== 'all') {
    places = places.filter(p => p.city.toLowerCase() === city.toLowerCase());
  }

  // Category filter
  if (category && category !== 'all') {
    places = places.filter(p => p.category === category);
  }

  // Cost filter
  if (maxCost) {
    const cost = Number(maxCost);
    places = places.filter(p => p.approxCostForOne <= cost);
  }

  // Free filter
  if (isFree === 'true') {
    places = places.filter(p => p.approxCostForOne === 0);
  }

  // Rating filter
  if (minRating) {
    places = places.filter(p => p.rating >= Number(minRating));
  }

  // Amenities
  if (hasWifi === 'true') {
    places = places.filter(p => p.hasWifi);
  }
  if (hasCharging === 'true') {
    places = places.filter(p => p.hasCharging);
  }
  if (isOutdoor === 'true') {
    places = places.filter(p => p.isOutdoor);
  }
  if (isQuiet === 'true') {
    places = places.filter(p => p.isQuiet);
  }

  // Search query (matches place name, city, state, description, area, category, perks)
  if (search) {
    const q = search.toLowerCase().trim();
    places = places.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.area && p.area.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.state && p.state.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      (p.studentPerks && p.studentPerks.some(perk => perk.toLowerCase().includes(q)))
    );
  }

  // Sorting
  if (sort) {
    switch (sort) {
      case 'rating':
        places.sort((a, b) => b.rating - a.rating);
        break;
      case 'cost_asc':
        places.sort((a, b) => a.approxCostForOne - b.approxCostForOne);
        break;
      case 'cost_desc':
        places.sort((a, b) => b.approxCostForOne - a.approxCostForOne);
        break;
      case 'reviews':
        places.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'distance':
        places.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
        break;
      default:
        break;
    }
  }

  res.json({
    total: places.length,
    city: city || 'All Cities',
    places
  });
};

export const getPlaceById = (req, res) => {
  const db = readDB();
  const place = db.places.find(p => p.id === req.params.id);
  if (!place) {
    return res.status(404).json({ error: 'Place not found' });
  }

  const reviews = db.reviews.filter(r => r.placeId === req.params.id);
  res.json({
    place,
    reviews
  });
};

export const createReview = (req, res) => {
  const db = readDB();
  const place = db.places.find(p => p.id === req.params.id);
  if (!place) {
    return res.status(404).json({ error: 'Place not found' });
  }

  const { rating, cleanliness, valueForMoney, studentFriendliness, comment, userName } = req.body;

  const newReview = {
    id: `rev-${Date.now()}`,
    placeId: req.params.id,
    userId: req.body.userId || 'usr-guest',
    userName: userName || 'College Student',
    rating: Number(rating) || 5,
    cleanliness: Number(cleanliness) || 5,
    valueForMoney: Number(valueForMoney) || 5,
    studentFriendliness: Number(studentFriendliness) || 5,
    comment: comment || 'Awesome place for students!',
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);

  // Recalculate rating
  const placeReviews = db.reviews.filter(r => r.placeId === req.params.id);
  const avgRating = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;
  place.rating = Number(avgRating.toFixed(1));
  place.reviewCount = placeReviews.length;

  writeDB(db);
  res.status(201).json({ success: true, review: newReview, place });
};
