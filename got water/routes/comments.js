var express = require("express");
var router  = express.Router({mergeParams: true});
var Camp = require("../models/camp");
var Comment = require("../models/comment");
var middleware    =require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find camp by id
    console.log(req.params.id);
    Camp.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {camp: camp});
        }
    });
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup camp using ID
   Camp.findById(req.params.id, function(err, camp){
       if(err){
           console.log(err);
           res.redirect("/camps");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error","Something went wrong, try again later");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               camp.comments.push(comment);
               camp.save();
               console.log(comment);
               req.flash("success","Comment successfully created");
               res.redirect('/camps/' + camp._id);
           }
        });
       }
   });
});

router.get("/:comment_id/edit",middleware.isCommentOwner,function(req,res){
    Comment.findById(req.params.comment_id,function(err, comment) {
        if(err){
            res.redirect("back");
        }else{
           res.render("comments/edit",{comment:comment,camp_id:req.params.id}); 
        }
    });
});
router.put("/:comment_id",middleware.isCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/camps/"+req.params.id);
        }
    });
});
router.delete("/:comment_id",middleware.isCommentOwner,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;