const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

exports.list = async (req, res, next) => {
  try {
    let query = {};
    if (req.user && req.user.role !== 'admin') {
      // Find all patients created by the user
      const patients = await Patient.find({ createdBy: req.user.id });
      const patientIds = patients.map(p => p._id);
      query = { patient: { $in: patientIds } };
    }

    const apps = await Appointment.find(query)
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

    // Enforce patient scoping
    if (req.user && req.user.role !== 'admin') {
      const patient = await Patient.findOne({ _id: app.patient._id, createdBy: req.user.id });
      if (!patient) {
        return res.status(403).json({ message: 'Access denied: You are not authorized to view this appointment.' });
      }
    }

    res.json(app);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    // Enforce patient scoping
    if (req.user && req.user.role !== 'admin') {
      const patient = await Patient.findOne({ _id: req.body.patient, createdBy: req.user.id });
      if (!patient) {
        return res.status(403).json({ message: 'Access denied: You cannot book an appointment for this patient profile.' });
      }
    }

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
    const appToUpdate = await Appointment.findById(req.params.id);
    if (!appToUpdate) return res.status(404).json({ message: 'Appointment not found' });

    // Enforce patient scoping
    if (req.user && req.user.role !== 'admin') {
      const patient = await Patient.findOne({ _id: appToUpdate.patient, createdBy: req.user.id });
      if (!patient) {
        return res.status(403).json({ message: 'Access denied: You cannot modify this appointment.' });
      }
      
      // Also check if they are trying to change it to a patient they don't own
      if (req.body.patient) {
        const newPatient = await Patient.findOne({ _id: req.body.patient, createdBy: req.user.id });
        if (!newPatient) {
          return res.status(403).json({ message: 'Access denied: You cannot assign this appointment to this patient profile.' });
        }
      }
    }

    const app = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(app);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const appToDelete = await Appointment.findById(req.params.id);
    if (!appToDelete) return res.status(404).json({ message: 'Appointment not found' });

    // Enforce patient scoping
    if (req.user && req.user.role !== 'admin') {
      const patient = await Patient.findOne({ _id: appToDelete.patient, createdBy: req.user.id });
      if (!patient) {
        return res.status(403).json({ message: 'Access denied: You cannot delete this appointment.' });
      }
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};
