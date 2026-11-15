const { Schema, model } = require('mongoose');
const text = require('./i18n');

module.exports = model(
  'News',
  new Schema({ title: text(true), body: text(), imageUrl: String }, { timestamps: true })
);
