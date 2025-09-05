const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/doctor.controller');

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

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

router.post('/',
  validate([
    body('name').isString().notEmpty(),
    body('specialization').isString().notEmpty(),
    body('availability').optional().isArray()
  ]),
  ctrl.create
);

router.put('/:id',
  validate([
    param('id').isMongoId()
  ]),
  ctrl.update
);

router.delete('/:id',
  validate([ param('id').isMongoId() ]),
  ctrl.remove
);

module.exports = router;
