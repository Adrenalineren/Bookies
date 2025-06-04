const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//Generate salt for encryption
const salt = bcrypt.genSaltSync(10); 
const secret = 'andowneiaosnqsdmvow';

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());


//Connect to database
mongoose.connect('mongodb+srv://admin:Bookiesadmin123@cluster0.gxfpsx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

//For register
app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt), //hash password
        });
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }
    

});

//For Login
app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    //Compare if password is same as in database
    const samePassword = bcrypt.compareSync(password, userDoc.password); 
    if (samePassword) {
        //Logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('Wrong password!');
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

//Clear the token so that user will be logged out
app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});

//To update avatar and bio
app.put('/profile', async (req,res) => {
    const {token} = req.cookies;
    const {avatar, bio} = req.body;
    try {
        const userDecoded = jwt.verify(token, secret);
        console.log("Decoded")
        const updatedUser = await User.findByIdAndUpdate(
            userDecoded.id,
            {avatar, bio},
            {new:true}
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(401).json('Unauthorized');
    }
});

//Get user info to display on profile page
app.get('/user', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json('No token');

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const userDoc = await User.findById(info.id);
    res.json(userDoc);
  });
});


app.listen(4000);

//mongodb+srv://admin:Bookiesadmin123@cluster0.gxfpsx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0