const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const uri = "mongodb://127.0.0.1/workoutWebsite";
let mongoose = require('mongoose');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let dbName = "workoutWebsite";
let database = {};
let myDB;


var connect = async function(dbName){
    try{
        await client.connect();
        await client.db("admin").command({ ping: 1 });

        myDB=client.db(dbName);

        if (!myDB){
            throw new Error("DB Connection Failed to start!");
        }
        else{
            console.log(`Connected to ${dbName}`);
            return myDB;
        }
    } catch(e){
        console.log(e.message);
    }
}

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("users", LoginSchema);

//Call get("<name_of_your_DB"> to initialize the db connection
//after that you can can call get() to just get the connection anywhere
database.get = function(dbName){
    if (myDB){
        console.log("Already connected!");
        return myDB;
    } else {
        return connect(dbName);
    }
}

//call close in your apps when you want to close the DB connection
database.close = async function(){

    try{
        await client.close();
        return;
    } catch(e){
        console.log(e.message);
    }
}

module.exports = { database, collection };

