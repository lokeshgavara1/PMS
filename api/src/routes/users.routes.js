const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Users endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id }, message: 'User detail endpoint' });
});

module.exports = router;
