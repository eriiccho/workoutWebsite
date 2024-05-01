// controller.js

var http = require("http");
var qString = require("querystring");
let express = require("express");
let app = express();
var ObjectID = require('mongodb').ObjectId;
let mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
let bp = require('body-parser');
let session = require('express-session');
const bcrypt = require('bcrypt');
const { database, collection } = require('./database');


app.listen(3000, async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/workoutWebsite', { useNewUrlParser: true, useUnifiedTopology: true })
        await database.get("workoutWebsite");
        console.log("Server is running...");
    } catch (e) {
        console.log(e.message);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('homepage')
});

app.get('/login', function (req, res) {
    res.render('login_page')
});

app.get('/workout', function (req, res) {
    res.render('workout_page')
});

app.get('/signup', function (req, res) {
    res.render('signup_page')
});

app.post('/signup', async (req,res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    const exist = await collection.findOne({name: data.name});
    if(exist){
        res.send("User already exists. Please reenter new username")
    }
    else {
        try{
            const userdata = await collection.create(data);
            console.log(userdata);
            res.redirect('/login');
        } catch(error){
            console.error("Error creating user:", error);
            res.status(500).send("Error creating user");
        }
    }
});

app.use('*', function (req, res) {
    res.writeHead(404);
    res.end(`<h1> ERROR 404. ${req.url} NOT FOUND</h1><br><br>`);
});

app.use((err, req, res, next) => {
    res.status(500).render('error', { message: err.message })
});

