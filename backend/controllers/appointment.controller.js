const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient'); // <-- add this

exports.list = async (req, res, next) => {
  try {
    const apps = await Appointment.find()
      .populate('doctor', 'name specialization')
      .populate('patient', 'name age');
    res.json(apps);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const app = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialization availability')
      .populate('patient', 'name age medicalHistory');
    if (!app) return res.status(404).json({ message: 'Appointment not found' });
    res.json(app);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const app = await Appointment.create(req.body);

    // 🔗 Add appointment reference to patient
    await Patient.findByIdAndUpdate(req.body.patient, {
      $push: { appointments: app._id }
    });

    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const app = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!app) return res.status(404).json({ message: 'Appointment not found' });
    res.json(app);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const app = await Appointment.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
