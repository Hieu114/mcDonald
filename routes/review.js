const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const McDonald = require('../models/store');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const s = await McDonald.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    s.review.push(review);
    await review.save();
    await s.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/stores/${s._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await McDonald.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/stores/${id}`);
}))

module.exports = router;