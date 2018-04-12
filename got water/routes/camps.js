var express=require("express");
var router=express.Router();
var middleware    =require("../middleware");
var Camp          =require('../models/camp.js');
var Comment       =require('../models/comment.js');
var User          =require("../models/user");
//INDEX ROUTE
router.get("/",function(req,res){
    Camp.find(function(err,foundCamps){
        if(err){
            console.log(err);
        }
       res.render("camps/index",{foundCamps:foundCamps,user:req.user});  
    });
});

//CREATE - add new camp to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to camps array
    var name = req.body.camp.name;
    var image = req.body.camp.image;
    var desc = req.body.camp.description;
    var price =req.body.camp.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: name, image: image,price:price, description: desc, author:author}
    // Create a new camp and save to DB
    Camp.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to camps page
            console.log(newlyCreated);
            res.redirect("/camps");
        }
    });
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render('camps/new');
});

//SHOW ROUTE
router.get("/:id",function(req, res) {
        console.log(req.user);
    Camp.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err){
            res.redirect('/camps');
        }else{
            console.log(found);
            res.render('camps/show',{found:found});
        }
    });
});

//DELETE ROUTE
router.delete("/:id",middleware.isCampOwner,function(req,res){
   //DESTROY poll
   Camp.findByIdAndRemove(req.params.id,function(err) {
       if(err){
           res.redirect("/");
       }else{
           res.redirect("/camps");

       }
   });
});
//EDIT ROUTE
router.get("/:id/edit",middleware.isCampOwner,function(req, res) {
    Camp.findById(req.params.id,function(err,foundcamp){
        if(err){
            req.flash("error","Camp not found");
        }
        res.render("camps/edit",{camp:foundcamp});
});
});

//UPDATE ROUTE
router.put("/:id",middleware.isCampOwner,function (req,res) {
    Camp.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatecamp){
        if(err){
            res.redirect("/");
        }else{
            res.redirect("/camps/"+req.params.id);
        }
    });
});

module.exports=router;