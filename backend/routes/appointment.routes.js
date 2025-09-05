const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/appointment.controller');

// ✅ Validation middleware
const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const err = new Error('Validation error');
      err.status = 422;
      err.details = result.array();
      return next(err);
    }
    next();
  }
];

// ✅ Routes
router.get('/', ctrl.list);          // GET all appointments
router.get('/:id', ctrl.get);        // GET one appointment

router.post('/',
  validate([
    body('patient').isMongoId().withMessage('Patient ID is required'),
    body('doctor').isMongoId().withMessage('Doctor ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('status').optional().isIn(['Scheduled', 'Completed', 'Cancelled'])
  ]),
  ctrl.create
);

router.put('/:id',
  validate([ param('id').isMongoId() ]),
  ctrl.update
);

router.delete('/:id',
  validate([ param('id').isMongoId() ]),
  ctrl.remove
);

module.exports = router;
