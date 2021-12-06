// const express = require('express');
// const router = express.Router();
// const McDonald = require('../store');
// const Review = require('../review');
// router.delete('/:rID', async (req, res)=>{
//     const {id, rID} = req.params;
//     await McDonald.findByIdAndUpdate(id, {$pull:{review: rID}});
//     await Review.findByIdAndDelete(rID);
//     res.redirect(`/stores/${id}`)
// })

// router.post('/', async (req, res)=>{
//     const s = await McDonald.findById(req.params.id);
//     console.log(req.body);
//     const r = new Review(req.body.review);
//     s.review.push(r);
//     await r.save();
//     await s.save();
//     res.redirect(`/stores/${s._id}`)
// })

// module.exports = router;