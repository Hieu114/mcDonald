const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js')

const McSchema = new Schema({
    location: String,
    price: Number,
    image: String,
    localMenu: String,
    fact: String,
    review:[
        {
            type: Schema.Types.ObjectId, 
            ref:'Review'
        }
    ]
})

McSchema.post('findOneAndDelete', async function (doc){
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})
module.exports = mongoose.model('McModel', McSchema);