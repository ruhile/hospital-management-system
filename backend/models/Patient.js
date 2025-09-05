const { Schema, model, Types } = require('mongoose');

const PatientSchema = new Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  medicalHistory: { type: String, default: '' },
  appointments: [{ type: Types.ObjectId, ref: 'Appointment' }]

}, { timestamps: true });

module.exports = model('Patient', PatientSchema);
