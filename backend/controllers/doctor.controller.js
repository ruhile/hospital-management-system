const Doctor = require('../models/Doctor');

// List
exports.list = async (req, res, next) => {
  try {
    const docs = await Doctor.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) { next(err); }
};

// Get one
exports.get = async (req, res, next) => {
  try {
    const doc = await Doctor.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

// Create
exports.create = async (req, res, next) => {
  try {
    const doc = await Doctor.create(req.body);
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

// Update
exports.update = async (req, res, next) => {
  try {
    const doc = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

// Delete
exports.remove = async (req, res, next) => {
  try {
    const doc = await Doctor.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
