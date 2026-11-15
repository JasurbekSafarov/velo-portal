module.exports = require('./crud')(require('../models/Result'), {
  sort: { place: 1 },
  filters: ['competition', 'category'],
  populate: 'competition',
});
