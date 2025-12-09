const mongoose = require('mongoose');

const serviceNewSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  
  titleKey: { type: String, required: false },
  descKey: { type: String, required: false },
  
  titleEn: { type: String, required: false },
  titleRo: { type: String, required: false },
  titleRu: { type: String, required: false },
  
  descEn: { type: String, required: false },
  descRo: { type: String, required: false },
  descRu: { type: String, required: false },
  
  price: { type: String, required: false },
  
  features: [{ type: String }],
  
  featuresEn: [{ type: String }],
  featuresRo: [{ type: String }],
  featuresRu: [{ type: String }],
  
  imageUrl: { type: String, required: false },
  details: { type: String, required: false },
  
  detailsEn: { type: String, required: false },
  detailsRo: { type: String, required: false },
  detailsRu: { type: String, required: false },
  
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
