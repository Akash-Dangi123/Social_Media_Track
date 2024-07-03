var express = require('express');
var router = express.Router();

const passport = require("passport");
var userModel = require("./users");
const postModel = require("./post")
const localStrategy = require("passport-local");
passport.use( new localStrategy(userModel.authenticate()) )

const multer  = require('multer');
const e = require('express');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + file.fieldname  )
  }
})
const upload = multer({ storage: storage })


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/forgotten', function(req, res, next) {
  res.render('forgotten');
});

router.get('/home', isLoggedIn, function(req, res, next) {
  // res.render('home');
  postModel.find()
  .populate("userId")
  .then(function(alldata){
    console.log(alldata)
    res.render("home",{alldata: alldata})
  })
  
});

router.get('/profile',function(req, res, next) {
  // console.log(req.user)
  userModel.findOne({username: req.user.username })
  .populate("postId")
  .then(function(profiledata){
    res.render("profile",{profiledata: profiledata})
  })
});

router.get('/signup', function(req, res, next) {
  res.render('register');
});

router.get('/gallery', function(req, res, next) {
  userModel.findOne({username: req.user.username})
  .populate("postId")
  .then(function(gallerydata){
    console.log(gallerydata)
    res.render("gallery",{gallerydata: gallerydata})
  })
});

router.post('/register', function(req, res) {
 console.log(req.body)

 var newUser = new userModel({
  username: req.body.username,
  mobile: req.body.mobile,
  email: req.body.email,
 })
 userModel.register(newUser, req.body.password)
 .then(function(para){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/home");
      })
 }) .catch(function(){
  res.send("errr something")
})
});

router.post('/profilepic',upload.single('image'), function(req, res, next) {
  // console.log(req.file.filename)
  // console.log(req.user.username)

  userModel.findOne({username: req.user.username })
  .then(function(userfound){
      // console.log(userfound)
      userfound.profilePic.push(req.file.filename)
      userfound.save()
      .then(function(){
          res.redirect(req.headers.referer)
      })
  })
});

router.post('/upload',upload.single('image'), function(req, res, next) {
  console.log(req.file.filename)

  userModel.findOne({username: req.user.username })
  .then(function(userfound){
     console.log(userfound)

   postModel.create({
    image: req.file.filename,
    userId: userfound._id
   })
  .then(function(imagecreated){
    console.log(imagecreated)
    userfound.postId.push(imagecreated)
    userfound.save()
    .then(function(){
      res.redirect("/home")
    })
  })
     
  })
});

router.post('/login', passport.authenticate("local",{
  successRedirect: "/home",
  failureRedirect: "/"
}),function(req, res, next) {});

router.get('/logout', function(req, res) {
  req.logOut(function(error){
   if(error){
    return next(error)
   }
     res.redirect("/");
  })

});

router.get("/like/:id",function(req,res,next){
//  console.log(req)
userModel.findOne({username: req.user.username })
.then(function(userfound){
  console.log(userfound)
  postModel.findOne({ _id: req.params.id})
  .then(function(photofound){
    console.log(photofound)

    
    if(photofound.likes.indexOf(userfound._id) === -1){
      photofound.likes.push(userfound._id)
    } else{
      var index = photofound.likes.splice(index,1)
    }
    photofound.save()
    .then(function(para){
      res.redirect(req.headers.referer)
    })
})
})
})

router.get("/report/:id",function(req,res,next){
  ///konsa banda report kar rha h
  ///konsi photo report ho rii h

  //kis base per banda dhude
  
  // console.log(req.user.username)

  userModel.findOne({username: req.user.username})
  .then(function(userfound){

    postModel.findOne({_id: req.params.id})
    .then(function(foundphoto){

      if(foundphoto.report.indexOf(userfound._id) === -1){

        foundphoto.report.push(userfound._id)

      } else{
          var index = foundphoto.report.indexOf(userfound._id)
          foundphoto.report.splice(index,1)
      }
        foundphoto.save()
        .then(function(){
          res.redirect(req.headers.referer)
        })
    })
  })
})

router.post('/comments/:id', function(req, res, next) {
  console.log(req.params.id);
  console.log(req.body.mycomment);

  userModel.findOne({username: req.session.passport.user})
  .then(function(userfound){

    const data = {
      text: req.body.mycomment,
      postedBy: userfound.username
    }
  
    postModel.findOne({_id: req.params.id})
    .then(function(photofound){
      photofound.comments.push(data)
      photofound.save()
    })
    .then(function(){
      res.redirect(req.headers.referer)
    })
  })
});

function isLoggedIn(req , res, next){
  if(req.isAuthenticated()){
      return next()
  }
  else{
    res.redirect("/")
  }
}


module.exports = router;
