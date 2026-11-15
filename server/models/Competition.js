const { Schema, model } = require('mongoose');
const text = require('./i18n');

module.exports = model(
  'Competition',
  new Schema(
    {
      title: text(true),
      discipline: { type: String, enum: ['road', 'track', 'mtb', 'bmx'], required: true },
      date: { type: Date, required: true },
      location: String,
      description: text(),
    },
    { timestamps: true }
  )
);
