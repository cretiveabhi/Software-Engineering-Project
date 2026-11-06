// Krishi Sarathi - Procurement Centres Controller
// Features: 10 MP Demo Centres, AI Scoring Engine, Live Weather Attachment, Open Centre Selection
import db, { isPostgres, getLocalStore } from '../config/database.js';
import { calculateCentreScore } from '../services/scoringEngine.js';
import { getCentreWeather } from '../services/weatherService.js';

export async function getAllCentres(req, res) {
  try {
    const { district, cropId } = req.query;
    const farmerDistrict = req.user?.district || 'Indore';

    let centres = [];
    if (isPostgres()) {
      let sql = 'SELECT * FROM procurement_centres WHERE 1=1';
      const params = [];
      if (district && district !== 'All') {
        params.push(district);
        sql += ` AND district = $${params.length}`;
      }
      sql += ' ORDER BY name ASC';
      const result = await db.query(sql, params);
      centres = result.rows;
    } else {
      const store = getLocalStore();
      centres = [...store.procurement_centres];
      if (district && district !== 'All') {
        centres = centres.filter(c => c.district.toLowerCase() === district.toLowerCase());
      }
    }

    // Enrich each centre with weather and AI Smart Score
    const enrichedCentres = await Promise.all(
      centres.map(async (centre) => {
        const weather = await getCentreWeather(centre);
        const scoring = calculateCentreScore({
          farmerDistrict,
          centre,
          weather
        });

        return {
          id: centre.id,
          centre_code: centre.centre_code,
          name: centre.name,
          hindi_name: centre.hindi_name,
          district: centre.district,
          address: centre.address,
          latitude: Number(centre.latitude),
          longitude: Number(centre.longitude),
          daily_capacity: Number(centre.daily_capacity),
          available_quota: Number(centre.available_quota),
          current_queue: Number(centre.current_queue),
          operational_status: centre.operational_status,
          contact_phone: centre.contact_phone,
          operator_name: centre.operator_name,
          is_demo: centre.is_demo !== false,
          smartScore: scoring.score,
          recommendationLabel: scoring.recommendationLabel,
          distanceKm: scoring.distanceKm,
          weather
        };
      })
    );

    // Sort by Smart AI Score descending
    enrichedCentres.sort((a, b) => b.smartScore - a.smartScore);

    return res.json({
      success: true,
      total: enrichedCentres.length,
      farmerDistrict,
      centres: enrichedCentres
    });
  } catch (err) {
    console.error('Error fetching centres:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch centres: ' + err.message });
  }
}

export async function getCentreById(req, res) {
  try {
    const { id } = req.params;
    let centre = null;

    if (isPostgres()) {
      const result = await db.query('SELECT * FROM procurement_centres WHERE id = $1', [id]);
      centre = result.rows[0];
    } else {
      const store = getLocalStore();
      centre = store.procurement_centres.find(c => c.id === id || c.centre_code === id);
    }

    if (!centre) {
      return res.status(404).json({ success: false, message: 'Procurement centre not found.' });
    }

    const weather = await getCentreWeather(centre);
    const scoring = calculateCentreScore({
      farmerDistrict: req.user?.district || 'Indore',
      centre,
      weather
    });

    return res.json({
      success: true,
      centre: {
        ...centre,
        latitude: Number(centre.latitude),
        longitude: Number(centre.longitude),
        daily_capacity: Number(centre.daily_capacity),
        available_quota: Number(centre.available_quota),
        current_queue: Number(centre.current_queue),
        smartScore: scoring.score,
        recommendationLabel: scoring.recommendationLabel,
        distanceKm: scoring.distanceKm,
        weather
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export default {
  getAllCentres,
  getCentreById
};
