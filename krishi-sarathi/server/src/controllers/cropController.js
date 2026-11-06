// Krishi Sarathi - Crop Controller
import db, { isPostgres, getLocalStore } from '../config/database.js';

export async function getAllCrops(req, res) {
  try {
    if (isPostgres()) {
      const result = await db.query('SELECT * FROM crops WHERE is_active = true ORDER BY name ASC');
      return res.json({ success: true, crops: result.rows });
    } else {
      const store = getLocalStore();
      const crops = store.crops.filter(c => c.is_active);
      return res.json({ success: true, crops });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch crops: ' + err.message });
  }
}

export async function getCropById(req, res) {
  try {
    const { id } = req.params;
    let crop = null;

    if (isPostgres()) {
      const result = await db.query('SELECT * FROM crops WHERE id = $1', [id]);
      crop = result.rows[0] || null;
    } else {
      const store = getLocalStore();
      crop = store.crops.find(c => c.id === id || c.crop_code === id) || null;
    }

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found.' });
    }

    return res.json({ success: true, crop });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function calculateEarnings(req, res) {
  try {
    const { cropId, quantity } = req.body;
    const qty = parseFloat(quantity);
    if (!cropId || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Valid cropId and positive quantity are required.' });
    }

    let crop = null;
    if (isPostgres()) {
      const result = await db.query('SELECT * FROM crops WHERE id = $1', [cropId]);
      crop = result.rows[0];
    } else {
      const store = getLocalStore();
      crop = store.crops.find(c => c.id === cropId);
    }

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found.' });
    }

    const msp = Number(crop.msp);
    const estimatedPayout = Math.round(qty * msp * 100) / 100;
    // Estimated open-market comparison (open market typically 12-18% below official MSP)
    const openMarketEstimatedRate = Math.round(msp * 0.85);
    const openMarketTotal = Math.round(qty * openMarketEstimatedRate);
    const farmerBenefit = estimatedPayout - openMarketTotal;

    return res.json({
      success: true,
      calculation: {
        cropName: crop.name,
        hindiName: crop.hindi_name,
        mspPerQuintal: msp,
        quantityQuintals: qty,
        officialMspPayout: estimatedPayout,
        openMarketEstimatedRate,
        openMarketTotal,
        farmerBenefitValue: farmerBenefit,
        unit: crop.unit,
        season: crop.season
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export default {
  getAllCrops,
  getCropById,
  calculateEarnings
};
