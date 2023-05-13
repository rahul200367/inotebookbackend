const express = require('express');
const mongoose = require('mongoose');
const mongoURl = 'mongodb+srv://rahulkaus07:Lb1yKcQloK8vVZkD@cluster0.quefu51.mongodb.net/inotebook?retryWrites=true&w=majority';
//const mongoURl = 'mongodb://localhost:27017/ecom?directConnection=true';
const  connectToMongo = ()=>{
    mongoose.connect(mongoURl, ()=>{
        console.log('connected to mongo sussesfully');
    })
}
module.exports = connectToMongo;