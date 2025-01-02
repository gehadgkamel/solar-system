const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')
require('dotenv').config();


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('MongoDB URI is not set.');
    process.exit(1);
}
console.log("MongoDB URI:", process.env.MONGO_URI);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

// function(err) {
//     if (err) {
//         console.log("error!! " + err)
//     } else {
//       //  console.log("MongoDB Connection Successful")
//       console.log('MongoDB URI:', process.env.MONGO_URI);
//     }
// })

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);



app.post('/planet',   function(req, res) {
   // console.log("Received Planet ID " + req.body.id)
    planetModel.findOne({
        id: req.body.id
    }, function(err, planetData) {
        if (err) {
            alert("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9")
            res.send("Error in Planet Data")
        } else {
            res.send(planetData);
        }
    })
})

app.get('/',   async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.get('/os',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.listen(3000, () => {
    console.log("Server successfully running on port - " +3000);
})


module.exports = app;