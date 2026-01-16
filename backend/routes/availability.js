const express = require('express');
const router = express.Router();
const {
  getAllAvailability,
  upsertAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');

router.get('/', getAllAvailability);
router.post('/', upsertAvailability);
router.delete('/:id', deleteAvailability);

module.exports = router;
