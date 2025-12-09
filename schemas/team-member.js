const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  imageUrl: { type: String, required: true },
  orderIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

teamMemberSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastDoc = await mongoose.model('TeamMember').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
module.exports = TeamMember;
