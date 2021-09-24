const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs')

//user model
const User = require('../models/User')

module.exports = function(passport){
passport.use (
    new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
        //match user
        User.findOne({email: email})
        .then(user=>{
            if(!user){
                return done(null,false,{message: 'Email not registered'})
            }

         //match password
         bcrypt.compare(password,user.password,(error, ismatch)=>{
              if(error)throw error
              if(ismatch){
                  return done(null,user)
              }
              else{
                  return done(null,false, {message: 'Password incorrect'})
              }
         })   
        })
        .catch(e=>console.log(e));
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}