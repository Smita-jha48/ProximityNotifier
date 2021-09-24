const express= require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
const { getStores,addStores } = require('../public/js/stores');

//model
const User= require("../models/User")

//login page
Router.get("/login",(req,res)=>{
    res.render("login");
})
//register page
Router.get("/register",(req,res)=>{
    res.render("register");
})

//post register
Router.post("/register",(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors =[];

    //checking required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields' });
    }
    //checking password
    if(password!=password2){
        errors.push({msg:'passwords do not match'});
    }

    //checking password length
    if(password.length<6)
    {
        errors.push({msg:'Password length must be greater than 6'});
    }
    if(errors.length>0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        User.findOne({email : email})
        .then(user =>{
            if(user){
                errors.push({msg: 'User exists'})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })

            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                  //Hash password
                  bcrypt.genSalt(10,(error,salt)=>
                  bcrypt.hash(newUser.password,salt,(error,hash)=>{
                       if(error)throw error
                        //set password to hash
                       newUser.password= hash;
                       //save the user
                       newUser.save()
                       .then(user => {
                           req.flash('success_msg',"You are successfully registered")
                           res.redirect('/users/login');
                       }
                        )
                       .catch(error => console.log(error));

                  }))
            }
        })
    }


})

//login post 
Router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

  //logout handle
  Router.get('/logout',(req,res)=>{
      req.logOut();
      req.flash('success_msg','You are logged out');
      res.redirect("/users/login");
  })

  //Store Locator
  
  Router.get('/storelocator',(req,res)=>{
      if(req.isAuthenticated()){
          res.render('storeloc');
      }
      else
      {
          res.redirect('/users/login');
      }
  });

  Router
  .route('/api/v1/stores')
  .get(getStores)
  .post(addStores);
  Router.get('/addstore',(req,res)=>{
      res.render('add');
  })
module.exports = Router;