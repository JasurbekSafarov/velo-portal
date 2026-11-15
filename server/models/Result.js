const { Schema, model } = require('mongoose');

module.exports = model(
  'Result',
  new Schema(
    {
      competition: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
      athlete: { type: String, required: true, trim: true },
      region: String,
      category: String,
      place: { type: Number, min: 1 },
      time: String,
      points: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);
