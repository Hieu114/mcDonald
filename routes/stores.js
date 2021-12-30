const express = require('express');
const router = express.Router();
const McDonald = require('../models/store')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateMcDonald, isAuthor } = require('../middleware');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = 'pk.eyJ1IjoiaGlldXR0cmFuIiwiYSI6ImNreDB4Zm95ZzEzOW8zMXBobzhoeHhtMGIifQ.iPTDgYA0L5fhzjMvo2tphg';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

router.get('/', catchAsync(async (req, res)=>{
    const stores = await McDonald.find({});
    res.render('stores.ejs', {stores, who:'All stores' })
}))

router.post('/', isLoggedIn, validateMcDonald, catchAsync(async (req, res, next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.store.location,
        limit: 1
    }).send()
    const s = new McDonald(req.body.store)
    s.geometry = geoData.body.features[0].geometry;
    s.author = req.user._id;
    await s.save()
    res.redirect(`/stores/${s._id}`)
}))

router.get('/new', isLoggedIn, (req, res) =>{
    res.render('new.ejs',{who: 'New Store'});
})

router.get('/:id', catchAsync (async (req, res) =>{
    const store = await McDonald.findById(req.params.id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!store) {
        req.flash('error', 'Cannot find that McDonald store!');
        return res.redirect('/stores');
    }
    const id = store._id;
    res.render('../views/card.ejs', {store, id})
}))

router.put('/:id', isLoggedIn, isAuthor, validateMcDonald, catchAsync (async (req, res)=>{
    const {id} = req.params;
    const s = await McDonald.findByIdAndUpdate(id, req.body.store, {runValidators: true, new: true});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/stores/${s._id}`)
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const s = await McDonald.findById(req.params.id)
    if (!s) {
        req.flash('error', 'Cannot find that McDonald store!');
        return res.redirect('/stores');
    }
    res.render('edit.ejs', {s, who: 'Edit store'});
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (async (req, res)=>{
    const {id} = req.params;
    await McDonald.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the store')
    res.redirect('/stores')
}))

module.exports = router;