import express from 'express';
import { getCentreWeather } from '../services/weatherService.js';
import db, { isPostgres, getLocalStore } from '../config/database.js';

const router = express.Router();

router.get('/centre/:centreId', async (req, res) => {
  try {
    const { centreId } = req.params;
    let centre = null;

    if (isPostgres()) {
      const result = await db.query('SELECT * FROM procurement_centres WHERE id = $1', [centreId]);
      centre = result.rows[0];
    } else {
      const store = getLocalStore();
      centre = store.procurement_centres.find(c => c.id === centreId || c.centre_code === centreId);
    }

    if (!centre) {
      return res.status(404).json({ success: false, message: 'Centre not found.' });
    }

    const weather = await getCentreWeather(centre);
    return res.json({ success: true, weather });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
