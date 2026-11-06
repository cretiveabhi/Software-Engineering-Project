// Krishi Sarathi - Weather Service (Open-Meteo API + Server-side Fallback Cache)
// Smart India Hackathon 2026 | PS: SIH26032
import axios from 'axios';
import db, { isPostgres, getLocalStore } from '../config/database.js';

// Weather code mapping according to WMO standard
const WMO_MAP = {
  0: { text: 'Clear Sky (साफ मौसम)', alert: 'Normal', message: 'Ideal conditions for grain unloading and transport.' },
  1: { text: 'Mainly Clear (हल्की धूप)', alert: 'Normal', message: 'Favorable weather for mandi yard operations.' },
  2: { text: 'Partly Cloudy (हल्के बादल)', alert: 'Normal', message: 'Good operational condition.' },
  3: { text: 'Overcast (घने बादल)', alert: 'Moderate Risk', message: 'Cloudy sky; keep covered transport advised.' },
  45: { text: 'Foggy (कोहरा)', alert: 'Moderate Risk', message: 'Low visibility on highway; drive cautiously.' },
  48: { text: 'Depositing Rime Fog', alert: 'Moderate Risk', message: 'High atmospheric moisture.' },
  51: { text: 'Light Drizzle (बूंदाबांदी)', alert: 'Moderate Risk', message: 'Grain moisture risk; cover open trolleys.' },
  53: { text: 'Moderate Drizzle', alert: 'Moderate Risk', message: 'Cover open trolleys with tarpaulin sheets.' },
  55: { text: 'Dense Drizzle', alert: 'Moderate Risk', message: 'Moisture alert; ensure grain sheds are accessible.' },
  61: { text: 'Slight Rain (हल्की बारिश)', alert: 'Moderate Risk', message: 'Grain protection mandatory. Covered sheds activated.' },
  63: { text: 'Moderate Rain (मध्यम बारिश)', alert: 'Severe Alert', message: 'High spoilage danger. Unloading restricted to indoor bays.' },
  65: { text: 'Heavy Rain (भारी वर्षा)', alert: 'Severe Alert', message: 'Severe weather alert. Suggesting alternative indoor centre.' },
  71: { text: 'Slight Snow/Hail', alert: 'Severe Alert', message: 'Severe alert.' },
  80: { text: 'Rain Showers (तेज बौछारें)', alert: 'Severe Alert', message: 'Rapid downpour warning; shelter grain immediately.' },
  81: { text: 'Moderate Rain Showers', alert: 'Severe Alert', message: 'High risk of moisture rejection at weighbridge.' },
  82: { text: 'Violent Rain Showers', alert: 'Severe Alert', message: 'High alert; mandi operations suspended temporarily.' },
  95: { text: 'Thunderstorm (आंधी-तूफान)', alert: 'Severe Alert', message: 'Severe thunderstorm; stay safe under permanent structures.' },
  96: { text: 'Thunderstorm with Hail', alert: 'Severe Alert', message: 'Hailstorm warning; protect grain from damage.' }
};

// In-memory runtime cache with 15-minute TTL
const memoryCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Fetch weather for a procurement centre
 * @param {Object} centre - Centre record with latitude, longitude, and id
 * @returns {Promise<Object>} Weather details
 */
export async function getCentreWeather(centre) {
  const cacheKey = `weather_${centre.id}`;
  const now = Date.now();

  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const lat = Number(centre.latitude);
  const lon = Number(centre.longitude);

  try {
    // Attempt live fetch from Open-Meteo API
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m',
        timezone: 'Asia/Kolkata'
      },
      timeout: 3500 // 3.5s timeout for high responsiveness
    });

    const current = response.data.current;
    const wCode = current.weather_code || 0;
    const wmo = WMO_MAP[wCode] || { text: 'Clear (सामान्य)', alert: 'Normal', message: 'Standard conditions.' };

    const weatherData = {
      centreId: centre.id,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rainProbability: current.precipitation_probability ?? (wCode >= 50 ? 70 : 10),
      windSpeed: current.wind_speed_10m,
      weatherCode: wCode,
      conditionText: wmo.text,
      alertLevel: wmo.alert,
      alertMessage: wmo.message,
      isLive: true,
      dataSource: 'Open-Meteo Live API',
      recordedAt: new Date().toISOString()
    };

    memoryCache.set(cacheKey, { timestamp: now, data: weatherData });
    return weatherData;
  } catch (err) {
    // Graceful fallback to stored / demo weather
    console.warn(`[Weather] Live API unavailable for ${centre.name} (${err.message}). Using verified demo fallback.`);
    return getFallbackWeather(centre);
  }
}

/**
 * Fallback to stored weather data in database or predefined demo records
 */
function getFallbackWeather(centre) {
  let fallback = null;

  if (isPostgres()) {
    // Handled in controller or query
  } else {
    const store = getLocalStore();
    const existing = store.weather_records?.find(w => w.centre_id === centre.id);
    if (existing) {
      fallback = {
        centreId: centre.id,
        temperature: Number(existing.temperature),
        humidity: Number(existing.humidity || 55),
        rainProbability: Number(existing.rain_probability),
        windSpeed: Number(existing.wind_speed),
        weatherCode: Number(existing.weather_code),
        conditionText: existing.condition_text,
        alertLevel: existing.alert_level,
        alertMessage: existing.alert_message,
        isLive: false,
        dataSource: 'Verified Demo / Cached Baseline',
        recordedAt: existing.recorded_at
      };
    }
  }

  if (!fallback) {
    fallback = {
      centreId: centre.id,
      temperature: 29.5,
      humidity: 52,
      rainProbability: 15,
      windSpeed: 11.2,
      weatherCode: 1,
      conditionText: 'Mainly Clear (हल्की धूप)',
      alertLevel: 'Normal',
      alertMessage: 'Optimal unloading conditions.',
      isLive: false,
      dataSource: 'Verified Demo Baseline',
      recordedAt: new Date().toISOString()
    };
  }

  return fallback;
}

export default {
  getCentreWeather
};
