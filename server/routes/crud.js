const express = require('express');
const mongoose = require('mongoose');
const { auth, staff } = require('../middleware/auth');

// Public: GET list / GET one. Protected (JWT): POST / PUT / DELETE.
module.exports = function crud(Model, { sort = { createdAt: -1 }, filters = [], populate = '' } = {}) {
  const router = express.Router();

  const fail = (e, res, next) =>
    e.name === 'ValidationError' || e.name === 'CastError'
      ? res.status(400).json({ message: e.message })
      : next(e);

  router.get('/', async (req, res, next) => {
    try {
      const q = {};
      // only plain strings, so query objects like ?a[$ne]=x can't reach MongoDB
      filters.forEach((f) => {
        if (typeof req.query[f] === 'string' && req.query[f]) q[f] = req.query[f];
      });
      let query = Model.find(q).sort(sort);
      if (populate) query = query.populate(populate);
      res.json(await query);
    } catch (e) {
      fail(e, res, next);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Not found' });
      let query = Model.findById(req.params.id);
      if (populate) query = query.populate(populate);
      const item = await query;
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (e) {
      fail(e, res, next);
    }
  });

  router.post('/', auth, staff, async (req, res, next) => {
    try {
      res.status(201).json(await Model.create(req.body));
    } catch (e) {
      fail(e, res, next);
    }
  });

  router.put('/:id', auth, staff, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Not found' });
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (e) {
      fail(e, res, next);
    }
  });

  router.delete('/:id', auth, staff, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Not found' });
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (e) {
      fail(e, res, next);
    }
  });

  return router;
};
