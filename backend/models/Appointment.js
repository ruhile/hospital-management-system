const { Schema, model, Types } = require('mongoose');

const AppointmentSchema = new Schema({
  patient: { type: Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = model('Appointment', AppointmentSchema);
