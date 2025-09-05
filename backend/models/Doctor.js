const { Schema, model } = require('mongoose');

const DoctorSchema = new Schema({
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  availability: [{ type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }]
}, { timestamps: true });

module.exports = model('Doctor', DoctorSchema);
