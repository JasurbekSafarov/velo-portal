// Bilingual text field: { kz, ru }. Kazakh is required when `required` is true.
module.exports = (required = false) => ({
  kz: { type: String, trim: true, required, default: required ? undefined : '' },
  ru: { type: String, trim: true, default: '' },
});
