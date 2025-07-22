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
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

//To load default profile picture
app.use(express.static(path.join(__dirname, 'public')));

//Generate salt for encryption
const salt = bcrypt.genSaltSync(10); 
const secret = process.env.JWT_SECRET;
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

//Connect to database
mongoose.connect(process.env.MONGO_URI);

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
        newPath = path + "." + ext;
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

app.delete('/post/:id', async (req,res) =>{
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.json({success:true});
})

//For Booklist 
app.post('/list', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json('you are UNAUTHORISED.');
        const {items} = req.body;
        // update existing or create new
        try {
            const listDoc = await List.findOneAndUpdate(
                {user: info.id},
                {items},
                {new: true, upsert:true}
            );
            return res.json(listDoc);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update list' });
        }
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


//For Chat function
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

app.post('/chat', async (req, res) => {
    const { messages } = req.body;
    console.log("Incoming message:", messages);

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { 
                                text: messages
                            }
                        ],
                    },
                ],
            }),
        });
        const data = await response.json();
        console.log("Gemini API response:", data);

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no reply.";
        res.json({ reply });

    } catch (error) {
        console.error("GEMINI API:", error);
        res.status(500).json({reply: 'Sorry, something went wrong.'});
    }
});

app.get('/search-users', async (req, res) => {
    const {query} = req.query;
    if (!query) return res.json([]);

    const users = await User.find({
        username: {$regex: new RegExp(query, 'i')},  
    }).select('username avatar');

    res.json(users);
});

app.post('/add-friend', async (req, res) => {
    const {token} = req.cookies;
    const {friendId} = req.body;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json('Unauthorised');

        const me = await User.findById(info.id);
        if (!me.friends.includes(friendId)) {
            me.friends.push(friendId);
            await me.save();
        }
        const friends = await User.find({_id: {$in: me.friends}}).select('username avatar');
        res.json(friends);
    });
});

app.get('/friends', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async(err, info) => {
        if (err) return res.status(401).json('Unauthorised');
        const user = await User.findById(info.id).populate('friends', 'username avatar');
        res.json(user.friends);
    });
});

app.get('/friend/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const friend = await User.findById(id, '-password');
        const posts = await Post.find({author: id}).sort({createdAt : -1});
        res.json({friend, posts});
    } catch (err) {
        res.status(500).json({error: 'Failed to load friend profile'});
    }
});

app.post('/unfriend/:id', async (req, res) => {
    const {token} = req.cookies;
    const { id } = req.params;
    
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json('Unauthorised');

        try {
            const myId = info.id;
            await User.findByIdAndUpdate(myId, {$pull: {friends: id}});
            await User.findByIdAndUpdate(id, {$pull: {friends: myId}});
            res.json({success: true});
        } catch (err) {
            res.status(500).json({success:false, error: err.message});
        }
    });
});

app.listen(4000);

//mongodb+srv://admin:Bookiesadmin123@cluster0.gxfpsx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0