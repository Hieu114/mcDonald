const express = require('express');
const router = express.Router();
const McDonald = require('../models/store')

router.get('/', async (req, res)=>{
    const stores = await McDonald.find({});
    res.render('stores.ejs', {stores, who:'All stores' })
})

router.post('/', async (req, res, next)=>{
    try{
        const s = new McDonald(req.body)
        await s.save()
        console.log(s)
        res.redirect(`/stores/${s._id}`)
    }
    catch(e){
        next(e)
    }
})

router.get('/new', (req, res) =>{
    res.render('new.ejs',{who: 'New Store'});
})

router.get('/:id', async (req, res) =>{
    const {id} = req.params;
    const store = await McDonald.findById(id).populate('review');
    res.render('card.ejs', {store, id, who:'Info'})
})

router.put('/:id', async (req, res)=>{
    const {id} = req.params;
    const s = await McDonald.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/stores/${s._id}`)
})

router.get('/:id/edit', async (req, res)=>{
    const {id} = req.params;
    const s = await McDonald.findById(id);
    res.render('edit.ejs', {s, who: 'Edit store'});
})

router.delete('/:id', async (req, res)=>{
    const {id} = req.params;
    await McDonald.findByIdAndDelete(id);
    res.redirect('/stores')
})

module.exports = router;