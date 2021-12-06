const McDonald = require('./models/store');
const data = require('./models/data/cityMcDonald');
const mongoose = require('mongoose');

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

const cityDB = async () =>{
    await McDonald.deleteMany({});
    for (i = 0; i < data[0].length; i++){
        const s = new McDonald({
            location: data[0][i],
            localMenu: data[1][i],
            image:"https://images.unsplash.com/photo-1606720335177-3d04e70fb13b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2251&q=80",
        })
        s.save()
        console.log(s)
    }
}

cityDB()