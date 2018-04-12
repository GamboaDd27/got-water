var Camp=require("../models/camp");
var Comment=require("../models/comment");
//MIDDEWARE
var middlewareObj={};

middlewareObj.isCampOwner=function(req,res,next){
    if(req.isAuthenticated()){
        Camp.findById(req.params.id, function(err, found){
           if(err){
               req.flash("error","Camp not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(found.author.id.equals(req.user._id)) {
                console.log(req.user._id);
                console.log(found.author.id);
                next();
            } else {
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
                console.log(req.user._id);
                console.log(found.author.id);
            }
           }
        });
    } else {
        req.flash("error","You have to login to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn =function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You have to login to do that");
    res.redirect("/login");
};

middlewareObj.isCommentOwner =function (req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, found){
           if(err){
               req.flash("error","Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(found.author.id.equals(req.user._id)) {
                console.log(req.user._id);
                console.log(found.author.id);
                next();
            } else {
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
                console.log(req.user._id);
                console.log(found.author.id);
            }
           }
        });
    } else {
        req.flash("error","You have to login to do that");
        res.redirect("back");
    }
};

module.exports=middlewareObj;