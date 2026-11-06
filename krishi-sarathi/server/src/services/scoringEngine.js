// Krishi Sarathi - Smart Centre Scoring & Allocation Engine
// Based on SIH 2026 Technical Solution (Slide 2 & 3):
// Distance Analysis, Queue Size Prediction, Weather & Operational Capacity Forecasts -> Score / 100

// Approximate coordinates for MP districts
const DISTRICT_COORDS = {
  'indore': { lat: 22.7196, lon: 75.8577 },
  'dewas': { lat: 22.9676, lon: 76.0534 },
  'ujjain': { lat: 23.1765, lon: 75.7885 },
  'bhopal': { lat: 23.2599, lon: 77.4126 },
  'sehore': { lat: 23.2031, lon: 77.0844 }
};

// Haversine formula to compute distance in km
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates a multi-factor Smart Centre Score out of 100:
 * 1. Distance factor (30 pts max): closer is better
 * 2. Quota Availability factor (25 pts max): more available quota = higher score
 * 3. Queue & Congestion factor (20 pts max): lower queue = shorter wait time
 * 4. Weather Risk factor (15 pts max): clear weather = higher score, rain risk = deduction
 * 5. Operational Status (10 pts max): Open = 10, High Load = 5, Closed = 0
 */
export function calculateCentreScore({
  farmerDistrict = 'Indore',
  farmerLat,
  farmerLon,
  centre,
  weather
}) {
  let score = 0;

  // 1. Distance analysis
  let dist = 15; // default fallback km
  const targetLat = farmerLat || (DISTRICT_COORDS[farmerDistrict.toLowerCase()]?.lat ?? 22.7196);
  const targetLon = farmerLon || (DISTRICT_COORDS[farmerDistrict.toLowerCase()]?.lon ?? 75.8577);

  dist = calculateDistance(targetLat, targetLon, Number(centre.latitude), Number(centre.longitude));

  // Closer centres score up to 30 pts (0-10km: 30pts, 10-25km: 25pts, 25-50km: 18pts, 50-80km: 10pts, >80km: 5pts)
  if (dist <= 10) score += 30;
  else if (dist <= 25) score += 25;
  else if (dist <= 50) score += 18;
  else if (dist <= 80) score += 12;
  else score += 6;

  // 2. Available Quota factor (25 pts max)
  const quotaRatio = Number(centre.available_quota) / (Number(centre.daily_capacity) || 1000);
  score += Math.min(25, Math.round(quotaRatio * 25));

  // 3. Queue & Congestion factor (20 pts max)
  const queue = Number(centre.current_queue) || 0;
  if (queue <= 5) score += 20;
  else if (queue <= 10) score += 15;
  else if (queue <= 20) score += 10;
  else score += 4;

  // 4. Weather Risk factor (15 pts max)
  if (weather) {
    if (weather.alert_level === 'Severe Alert' || weather.rain_probability > 60) {
      score += 2; // severe weather penalty
    } else if (weather.alert_level === 'Moderate Risk' || weather.rain_probability > 30) {
      score += 8;
    } else {
      score += 15; // clear & safe weather bonus
    }
  } else {
    score += 12; // default
  }

  // 5. Operational Status factor (10 pts max)
  if (centre.operational_status === 'Open') score += 10;
  else if (centre.operational_status === 'High Load') score += 5;
  else score += 0;

  // Clamp between 20 and 99
  const finalScore = Math.max(25, Math.min(98, Math.round(score)));

  let recommendationLabel = 'Recommended';
  if (finalScore >= 85) recommendationLabel = 'Highly Recommended (Smart Choice)';
  else if (finalScore >= 70) recommendationLabel = 'Good Alternative';
  else if (finalScore >= 50) recommendationLabel = 'Moderate Wait Time Expected';
  else recommendationLabel = 'Congested / Weather Alert';

  return {
    score: finalScore,
    distanceKm: dist,
    recommendationLabel,
    factors: {
      distance: dist,
      quotaAvailable: Number(centre.available_quota),
      queueSize: queue,
      weatherAlert: weather?.alert_level || 'Normal'
    }
  };
}

export default {
  calculateDistance,
  calculateCentreScore
};
