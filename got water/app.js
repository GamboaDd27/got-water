var bodyParser = require("body-parser"), 
methodOverride = require("method-override"),
mongoose      = require("mongoose"),
express       = require("express"),
Camp          =require('./models/camp.js'),
Comment       =require('./models/comment.js'),
seedDb        =require("./seeds.js"),
passport      =require("passport"),
flash         =require("connect-flash"),
LocalStrategy =require("passport-local"),
User          =require("./models/user"),
app           =express();
console.log();
//ROUTES
var commentRoutes=require("./routes/comments"),
campsRoutes=require("./routes/camps"),
indexRoutes=require("./routes/index");

//APP CONFIG
//SEED DATABASE
// seedDb();
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://localhost/yelpcamp");
// mongoose.connect("mongodb://huevo:rusty@ds119449.mlab.com:19449/yelpcamp");
// mongodb://huevo:rusty@ds119449.mlab.com:19449/yelpcamp
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"m!:LoDs6==Bg|5YqDC[o?2n@90Xx9< siono pútá mádré お前わもう死んで　剣まりか　操你妈逼啊被扰乱 农村补哦地跨 and stufff my b. this guy deadasss a feget siono xds",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});
app.use(indexRoutes);
app.use("/camps",campsRoutes);
app.use("/camps/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});