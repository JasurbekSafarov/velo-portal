const { Schema, model } = require('mongoose');

module.exports = model(
  'User',
  new Schema(
    {
      name: { type: String, trim: true, default: '' },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      passwordHash: { type: String, required: true },
      role: { type: String, enum: ['admin', 'editor', 'athlete'], default: 'athlete' },
    },
    { timestamps: true }
  )
);
