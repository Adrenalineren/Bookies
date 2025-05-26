const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();

const salt = bcrypt.genSaltSync(10); //generate salt for encryption

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:Bookiesadmin123@cluster0.gxfpsx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');


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

app.listen(4000);

//mongodb+srv://admin:Bookiesadmin123@cluster0.gxfpsx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0