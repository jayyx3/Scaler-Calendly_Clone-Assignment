const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getAllMeetings,
  cancelMeeting
} = require('../controllers/bookingController');

router.get('/slots', getAvailableSlots);
router.post('/', createBooking);
router.get('/meetings', getAllMeetings);
router.put('/meetings/:id/cancel', cancelMeeting);

module.exports = router;
