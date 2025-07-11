const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const List = require('./models/List');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const uploadAvatar = multer({ dest: 'uploads/' });
const fs = require('fs');
//Generate salt for encryption
const salt = bcrypt.genSaltSync(10); 
const secret = 'andowneiaosnqsdmvow';

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

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
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
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
app.put('/profile', uploadAvatar.single('avatar'), async (req,res) => {
  const { token } = req.cookies;
  const { bio } = req.body;
  let avatarPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    const fileName = newPath.split(/[/\\]/).pop();  
    avatarPath = '/uploads/' + fileName
  }

  try {
    const userDecoded = jwt.verify(token, secret);
    const updateData = { bio: req.body.bio };
    if (avatarPath) {
      updateData.avatar = avatarPath;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userDecoded.id,
      updateData,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
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

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, review, content, genres, rating} = req.body;
        const genresArray = JSON.parse(genres);
        const postDoc = await Post.create({
        title, 
        review,
        content,
        cover:newPath,
        author: info.id,
        genres: genresArray,
        rating: parseInt(rating),
        });
    res.json(postDoc);
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id, title, review, content, genres, rating} = req.body;
        const genresArray = JSON.parse(genres);
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are NOT the author, get OUT');
        }
        postDoc.title = title;
        postDoc.review = review;
        postDoc.content = content;
        if (newPath) {
            postDoc.cover = newPath;
        }
        postDoc.genres = genresArray;
        postDoc.rating = parseInt(rating);
        await postDoc.save();
        res.json(postDoc);
    });
});

app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.post('/list', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json('you are UNAUTHORISED.');
        const {items} = req.body;
        // update existing or create new
        const listDoc = await List.findOneAndUpdate(
            {user: info.id},
            {items},
            {new: true, upsert:true}
        );
    });
});

app.get('/list', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json('you are UNAUTHORISED.');
        const listDoc = await List.findOne({user: info.id});
        res.json(listDoc || {items: []});
    });
});

app.listen(4000);

//mongodb+srv://admin:Bookiesadmin123@cluster0.gxfpsx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0