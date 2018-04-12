var express=require("express");
var router=express.Router();
var Camp          =require('../models/camp.js');
var Comment       =require('../models/comment.js');
var User          =require("../models/user");
var passport      =require("passport");
var middleware    =require("../middleware");
//LANDING ROUTE
router.get("/",function(req,res){
  res.render("landing");
});




//AUTH ROUTES

//REGISTER FORM
router.get("/register",function(req, res) {
    res.render("register");
});
//SING-UP ROUTE
router.post("/register",function(req, res) {
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render('register',{error:err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Got water? " + user.username);
            res.redirect("/camps");
        });
    });
});
//LOGIN FORM
router.get("/login",function(req, res) {
    res.render("login");
});
//LOGIN ROUTE
router.post("/login",passport.authenticate("local",{
    successRedirect:"/camps",
    failureRedirect:"/login"
}),function(req, res) {
    
});
//LOGOUT ROUTE
router.get('/logout',function(req, res) {
    req.logout();
    req.flash("success","Logged you out");
    res.redirect('camps');
});

module.exports=router;
