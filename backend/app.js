const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const doctorRoutes = require('./routes/doctor.routes');
const patientRoutes = require('./routes/patient.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const authRoutes = require('./routes/auth.routes');

const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth.middleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', protect, doctorRoutes);
app.use('/api/patients', protect, patientRoutes);
app.use('/api/appointments', protect, appointmentRoutes);

app.use(errorHandler);

module.exports = app;
