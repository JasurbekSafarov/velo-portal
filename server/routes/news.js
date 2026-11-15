module.exports = require('./crud')(require('../models/News'), { sort: { createdAt: -1 } });
