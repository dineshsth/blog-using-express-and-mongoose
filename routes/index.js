var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const multer = require('multer');

const multerConfig = {
  storage : multer.diskStorage({
    destination :function(req,file,next){
      next(null,'./public/upload');
    },
    filename : function(req,file, next){
      console.log(file);
      const ext = file.mimetype.split('/')[1];
      next(null,file.originalname);
    }
  }),
  fileFilter : function(req,file, next){
    if(!file){
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if(image){
      next(null,true);
    }
    else{
      next({message:'file type not supported'},false);
    }
  }
};

mongoose.connect('localhost:27017/Post');
var Schema = mongoose.Schema;
// var date = new Date();
// date.toDateString();
var userPostSchema = new Schema({
  heading:{type:String, required:true},
  title:{type:String, required:true},
  description:{type:String, required:true},
  image:{type: String},
  date:{type:Date, default:Date.now}
},{collection: 'user-post'});
var UserPost = mongoose.model('UserPost', userPostSchema);



/* GET home page. */
router.get('/', function(req, res, next) {
  UserPost.find().then(function(doc){
  res.render('index',{items:doc});
});
});



router.get('/blog', function(req,res,next){
  UserPost.find().then(function(doc){
  res.render('blog',{items:doc});
});
})


router.get('/play', function(req,res,next){
  res.render('play');
})

router.get('/post', (req,res,next)=>{
  res.render('post');
})

router.post('/post', multer(multerConfig).single('image'), (req,res,next)=>{
  console.log(req.body.image);
  req.body.image = req.file.filename;
  var items = {
   heading: req.body.heading,
   title:req.body.title,
   description:req.body.description,
   image: req.body.image,
 }
    var data = new UserPost(items);
    // new UserVideo(req.body).save();
    data.save();
    res.redirect('/');

})

router.get('/blog:id',(req,res,next)=>{
var dinesh = req.params.id;
var id = dinesh.slice(1);
  UserPost.findById(id).then(function(doc){
    res.render('blog-no',{items:doc});
  })
  // res.send("your are at "+ req.params.id);
})
router.use((req,res,next)=>{
  res.render('maintenance.hbs');
})


router.get('/login', function(req,res,next){
  res.render('form');
});

router.post('/login',(req,res,next)=>{

    username = req.body.username;
    password = req.body.password;

    if(username =='dinesh' && password == 'dinesh'){
      count = true;
      console.log(req.body);
      res.redirect('/');
  }
    else{

      res.redirect('/login');
  }

})


router.get('/signup', (req,res,next)=>{
  res.render('signup');
})

router.post('/signup', (req,res,next)=>{
   password = req.body.password;
   password1 = req.body.password1;
   username = req.body.username;
   console.log(req.body);
  if(username!=null && (password && password1)!=null && password === password1){

      res.redirect('/signup');

  }
  else{
    res.redirect('/');
  }
})





module.exports = router;
