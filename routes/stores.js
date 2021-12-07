const express = require('express');
const router = express.Router();
const McDonald = require('../models/store')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

router.get('/', catchAsync(async (req, res)=>{
    const stores = await McDonald.find({});
    res.render('stores.ejs', {stores, who:'All stores' })
}))

router.post('/', async (req, res, next)=>{
    try{
        const s = new McDonald(req.body)
        await s.save()
        res.redirect(`/stores/${s._id}`)
    }
    catch(e){
        next(e)
    }
})

router.get('/new', isLoggedIn, (req, res) =>{
    res.render('new.ejs',{who: 'New Store'});
})

router.get('/:id', catchAsync (async (req, res) =>{
    const {id} = req.params;
    const store = await McDonald.findById(id).populate('review');
    res.render('card.ejs', {store, id, who:'Info'})
}))

router.put('/:id', isLoggedIn, catchAsync (async (req, res)=>{
    const {id} = req.params;
    const s = await McDonald.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/stores/${s._id}`)
}))

router.get('/:id/edit', isLoggedIn, catchAsync (async (req, res)=>{
    const {id} = req.params;
    const s = await McDonald.findById(id);
    res.render('edit.ejs', {s, who: 'Edit store'});
}))

router.delete('/:id', isLoggedIn, catchAsync (async (req, res)=>{
    const {id} = req.params;
    await McDonald.findByIdAndDelete(id);
    res.redirect('/stores')
}))

module.exports = router;