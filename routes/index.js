const express= require("express");
const Router = express.Router();
const {ensureAuthenticated}=require("../config/auth");


Router.get("/",(req,res)=>{
    res.render("welcome");
})

Router.get("/dashboard",ensureAuthenticated,(req,res)=>{
    res.render("dashboard",{
        name: req.user.name
    });
})
module.exports = Router;