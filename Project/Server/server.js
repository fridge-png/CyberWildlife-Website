// requiring all the modules used in the server
const express= require('express');
const upload = require('./multer_file');
const bodyParser = require('body-parser');
const DBModels = require("./db_file");
const ExperienceModel = DBModels.ExperienceModel;
const UserModel = DBModels.UserModel;
const ejs = require('ejs');
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

// setting up the server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  
  extended: true
})); 
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'));
app.use('/uploads', express.static('../uploads'));
app.use('/styles', express.static('../styles'));
app.use('/scripts', express.static('../DOM scripts'));
app.use('/images', express.static('../Images'));
app.use('/fonts', express.static('../fonts'));
app.use(session({ secret: "secretToken"}));

// this function is called to check if the jwt token is active
// this function is used as middleware so that the server knows the current user
function authenticateToken(req , res , next){

  const session = req.session;

  // if the session does not contain a userid, the user is redirected to the signin page to sign in
  if(!session.userid)
    return res.redirect('/');
  
  else{
      // the current user's user token is verified using the secret token
      jwt.verify(session.userid,'5656b5f4116024c521801f6c998cd79a32d1d8671c9b108a71aea5463efc38bda1f91ba6993be97bcb6489ad27cdf7eb0a21bff320988fca98ca7d5d443c02a1',(err,user)=>{
      // the username is extracted from the jwt
        req.user=user.username;
    });

    next();

  }

}

// the base url renders the sign in and sign up page
app.get('/' ,(req,res)=>{
    res.render('signinup');

});

// when the user clicks on log out, their respective session is deleted and they are redirected to the sign in page
app.post('/logout' , (req,res)=>{
  req.session.userid=null;
  res.redirect('/');
});

// when the user enters their credentials and signs in
app.post('/signin' ,(req,res)=>{

  //get username from form
  const username = req.body.username;

  //authenticate that user exists in database
  UserModel.findOne({username:username},(err,user)=>{
    if(err){
      return res.redirect('/');
    }
    else if(user==null){
      return res.redirect('/');
    }
    else{
    const password = req.body.password;
    //compare input password with hashed password in database
    bcrypt.compare(password,user.password,(err,isMatch)=>{

      if(isMatch){
        let user = {username:username};
        //create a json web token that corresponds to the username
        const accessToken = jwt.sign(user,'5656b5f4116024c521801f6c998cd79a32d1d8671c9b108a71aea5463efc38bda1f91ba6993be97bcb6489ad27cdf7eb0a21bff320988fca98ca7d5d443c02a1');
        //set session cookie to the token
        req.session.userid = accessToken;
        req.session.cookie._expires=100000;
        res.redirect("/home");
      }

      });
    }
  });
});

// when the user that is not registed enters their credentials and signs up
app.post('/signup' ,(req,res)=>{

  // hashing the password in order to insert it into the mongodb database
  bcrypt.hash(req.body.password, 1, (err, hash) => {
    if (err) {
      return;
    }
    // creating a user object with the user's credentials
    const newUser = new UserModel({
      username: req.body.username,
      password:hash,
      full_name: req.body.full_name,
    });
  
    // adding the user object to the database
    newUser.save((err, result) => {
      if (err) {
        console.log(err);
      }
    });
  
    // redirecting the user to the sign in page to sign in with their new account
    res.redirect('/');
  })

});

// when the user goes to the home page
app.get('/home' ,authenticateToken,(req,res)=>{

  res.render('home');

});

// when the user goes to the about page
app.get('/about' ,authenticateToken,(req,res)=>{
  
    res.render('about');

});

// when the user goes the bamboo forest page
app.get('/bamboo_forest' ,authenticateToken,(req,res)=>{
  let experiences = [];
    
  // the experiences are selected from the database
  ExperienceModel.find().then((res)=>{
    experiences = res;

  }).then(()=>{

    // experiences is sent to the ejs file to be displayed
    res.render('bamboo_forest',{experiences: experiences});
  });

});

// when the user goes the penguin peak page
app.get('/penguin_peak', authenticateToken,(req,res)=>{

  let experiences = [];
    
  // the experiences are selected from the database
  ExperienceModel.find().then((res)=>{
    experiences = res;

  }).then(()=>{

    // experiences is sent to the ejs file to be displayed
    res.render('penguin_peak',{experiences: experiences});
  });
  

});

// when the user goes the alligator swamp page
app.get('/alligator_swamp', authenticateToken,(req,res)=>{

  let experiences = [];
    
  // the experiences are selected from the database
  ExperienceModel.find().then((res)=>{
    experiences = res;

  }).then(()=>{

    // experiences is sent to the ejs file to be displayed
    res.render('alligator_swamp',{experiences: experiences});
  });

});

// when the user opens their profile
app.get('/profile' ,authenticateToken,(req,res)=>{
  let experiences = [];
  let user;

  // the username is taken from the current session
  const username = req.user;

    // the experiences that contain the user's username are selected (aka the user's experiences)
    ExperienceModel.find({username:username}).then((res)=>{
      experiences = res;
    }).then(()=>{
      // the user information is selected from the database
      UserModel.findOne({username:username},(err,result)=>{
        user = result;
        // the information is sent to the profile ejs to be displayed
        res.render('profile',{experiences : experiences, user: user});
      });

    });
});

// when the user adds a new experience
app.post("/processForm",authenticateToken,upload.single("user_image"),(req,res)=>{
    
    // creating an experience object with the user information and username (from the session)
    const newExperience = new ExperienceModel({
      username: req.user,
      title: req.body.title,
      photo:req.file.path,
      description: req.body.desc
    });

    // adding the experience object to the database
    newExperience.save((err, result) => {
      if (err) {
        console.log(err);
      }
    });

    // the name of the previous page is sent as a hidden value in the post request in order to redirect back to the previous page
    res.redirect("/" + req.body.original);
});

// when the user deletes an experience on their profile
app.post("/deleteForm" , (req,res)=>{
    
  // get the id that is sent as the value of the submit button and delete the found experience
  ExperienceModel.deleteOne({_id : req.body.submit}).then(()=>{
    res.redirect('/profile');
  });

});

// when the user adds and updates their profile photo
app.post("/addImage" ,authenticateToken,upload.single("profile_image"), (req,res)=>{

  if (typeof(req.file) != 'undefined'){
    // the user's username is taken from the session and the photo is added to that user's information
    UserModel.updateOne({username:req.user},
    {$set : {photo : req.file.path}} ).then(()=>{
      res.redirect('/profile');
    });
  }
  res.redirect('/profile');

});

// custom api created to retrieve when the profile was created
app.get("/getProfileInfo" ,authenticateToken,(req,res)=>{

  UserModel.findOne({username : req.user}, (err,user)=>{
    res.send(user._id.getTimestamp());
  })


});

const server = app.listen(8081, function () {
    const port = server.address().port;
    console.log(`app listening at  ${port}`);
  });
  