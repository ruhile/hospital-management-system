const Patient = require('../models/Patient');

exports.list = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const filter = q ? { $text: { $search: q } } : {};
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

    res.json(patient);
  } catch (err) {
    next(err);
  }
};


exports.create = async (req, res, next) => {
  try {
    const p = await Patient.create(req.body);
    res.status(201).json(p);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'Patient not found' });
    res.json(p);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const p = await Patient.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Patient not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};