module.exports = require('./crud')(require('../models/Competition'), {
  sort: { date: 1 },
  filters: ['discipline'],
});
