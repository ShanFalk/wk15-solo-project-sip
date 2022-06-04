const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const { User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const{ Review } = require('../../db/models');

const validateReviewCreate = [
  check('userId')
    .exists({ checkFalsy: true}),
  check('businessId')
    .exists({ checkFalsy: true}),
  check('rating')
    .exists ({checkFalsy: true})
    .withMessage('Please enter a rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Please enter a rating between 1 and 5'),
  check('answer')
    .exists ({checkFalsy: true})
    .withMessage('Please enter a review'),
  handleValidationErrors
];

router.get('/:businessId', asyncHandler(async (req, res) => {
    const bizId = parseInt(req.params.businessId, 10)
    const reviews = await Review.findAll({
        where: {
          businessId: bizId
        },
        include: User
      })
    return res.json({ reviews });
}));

router.post('/', requireAuth, validateReviewCreate, asyncHandler(async(req, res) => {

  const {
    userId,
    businessId,
    rating,
    answer
  } = req.body;

  const review = await Review.create({
    userId,
    businessId,
    rating,
    answer
  });
  return await Review.findByPk(review.id);
}))

module.exports = router;
