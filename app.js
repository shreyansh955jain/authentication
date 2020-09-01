
require('dotenv').config();

 //it is important to use environment variable  at the top most  of all
 //because it really nesseccary to that it will be active or runnig continue and call config the file.
const express = require("express");
const bodyParser = require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
//use all express module

const app = express();
//this line set view engine
app.set('view engine', 'ejs');
//this line is express body parser module
app.use(bodyParser.urlencoded({extended: true}));
// this line make folder static so we can use bodyParser module.
app.use(express.static("public"));
//this line use to conncet mongoDB with mongoose a module which makes easy to work with Database.
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
//this line define object structure .
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//make sure that delete all space in your secret.
//console.log(process.env.API_KEY);
//how to use environment variable ?
// make sure that check the documentation
//to access the environment variable we need to use write process.env.VARIABLE_NAME  ..

userSchema.plugin(encrypt,{ secret: process.env.SECRET, encryptedFields: ['password'] });


const User =mongoose.model("User",userSchema);

app.get("/home",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/login",function(req,res){

  User.findOne({email:req.body.username},function(err,userFind){
if(err){
console.log(err);
}else{
    if(userFind.password ===req.body.password){
    res.render("secrets");
  }
  }
  });
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){

  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
newUser.save(function(err){
  if(!err){
    res.render("secrets");
  }else{
    console.log(err);
  }
});
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
