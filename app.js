const express = require('express');
const app = express();
const path = require('path');
const McDonald = require('./models/store');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/review');
const restaurant = require('./routes/stores');
// const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/mcDonald', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", ()=>{
    console.log("Database connected")
})

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/stores', restaurant);


app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('home.ejs',{who:'McDonald Home'})
})

app.delete('/stores/:id/review/:rID', async (req, res)=>{
    const {id, rID} = req.params;
    await McDonald.findByIdAndUpdate(id, {$pull:{review: rID}});
    await Review.findByIdAndDelete(rID);
    res.redirect(`/stores/${id}`)
})

app.get('/mcDB', async (req, res)=>{
    const firstMcDonald = new McDonald({location: 'Hanoi', localMenu:'pho burger'});
    const s = await firstMcDonald.save();
    res.send(firstMcDonald)
})

app.post('/stores/:id/review', async (req, res)=>{
    const s = await McDonald.findById(req.params.id);
    const r = new Review(req.body.review);
    s.review.push(r);
    await r.save();
    await s.save();
    res.redirect(`/stores/${s._id}`)
})

app.use((err,req,res,next)=>{
    res.send("OH NO")
})

app.listen(3000, ()=> {
    console.log("Listening on port 3000!!")
})