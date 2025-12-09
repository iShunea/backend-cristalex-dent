const mongoose = require('mongoose');

const serviceNewSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  titleKey: { type: String, required: true },
  descKey: { type: String, required: true },
  price: { type: String, required: true },
  features: [{ type: String }],
  imageUrl: { type: String, required: true },
  details: { type: String },
  orderIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

serviceNewSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastDoc = await mongoose.model('ServiceNew').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

const ServiceNew = mongoose.model('ServiceNew', serviceNewSchema);
module.exports = ServiceNew;
