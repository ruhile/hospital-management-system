const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/patient.controller');

const validate = (rules) => [...rules, (req,res,next)=> {
  const { validationResult } = require('express-validator');
  const r = validationResult(req);
  if (!r.isEmpty()) {
    const err = new Error('Validation error'); err.status = 422; err.details = r.array(); return next(err);
  } next();
}];

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

router.post('/',
  validate([
    body('name').isString().notEmpty(),
    body('age').isInt({ min: 0 }),
    body('medicalHistory').optional().isString()
  ]),
  ctrl.create
);

router.put('/:id', validate([ param('id').isMongoId() ]), ctrl.update);
router.delete('/:id', validate([ param('id').isMongoId() ]), ctrl.remove);

module.exports = router;
