const Patient = require('../models/Patient');

exports.list = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    let filter = q ? { $text: { $search: q } } : {};
    
    // Scoping: non-admins only see patients they created
    if (req.user && req.user.role !== 'admin') {
      filter.createdBy = req.user.id;
    }

    const items = await Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Patient.countDocuments(filter);
    res.json({ data: items, total });
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate({
        path: 'appointments',
        populate: { path: 'doctor', select: 'name specialization' }
      });

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Enforce scoping
    if (req.user && req.user.role !== 'admin' && patient.createdBy && patient.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You are not authorized to view this patient profile.' });
    }

    res.json(patient);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // Set creator ID
    if (req.user) {
      req.body.createdBy = req.user.id;
    }
    const p = await Patient.create(req.body);
    res.status(201).json(p);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Enforce scoping
    if (req.user && req.user.role !== 'admin' && patient.createdBy && patient.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You cannot modify this patient record.' });
    }

    const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(p);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Enforce scoping
    if (req.user && req.user.role !== 'admin' && patient.createdBy && patient.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You cannot delete this patient record.' });
    }

    await Patient.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
};