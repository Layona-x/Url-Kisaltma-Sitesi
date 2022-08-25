/*   Required   */
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const app = express();
let port = 3000;
app.use(cookieParser());
const Url = require("./models/url.js");
const User = require("./models/user.js");
const dotenv = require("dotenv");
dotenv.config();
const conn = require("./mongoose.js");
conn();
const morgan = require("morgan");
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.listen(port, () => {
  console.log("mongoDB Bağlantı kuruldu");
});
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*   Servers   */
/*  Yönlendirme  */
app.get("/", async function (req, res) {
  let userId = req.cookies.id;
  if (userId) {
    User.findById(userId).then((result) => {
      res.render(`${__dirname}/views/pages/home.ejs`);
    });
  } else {
    res.redirect("/register");
  }
});
/* Kayıt , Login , Kullanıcı Sayfası İşlemleri */
app.get("/register", async function (req, res) {
  res.render(`${__dirname}/views/register/register.ejs`);
});

app.get("/login", async function (req, res) {
  res.render(`${__dirname}/views/register/login.ejs`);
});

app.post("/register", async function (req, res) {
  User.findOne(
    { name: req.body.username, password: req.body.password },
    (user, err) => {
      if (user) {
      } else {
        const user = new User({
          name: req.body.username,
          password: req.body.password,
        });
        user.save().then((result) => {
          res.redirect("/login");
        });
      }
    }
  );
});

app.post("/login", async function (req, res) {
  let user_name = req.body.username;
  let pass = req.body.password;
  let user = req.params.id
  User.find({ name: user_name, password: pass }).then((result) => {
     Url.findOne({ userId:req.params.id }).sort().then((urlResult)=>{
    User.findOne({ name: user_name, password: pass }).then((userResult) => {
      if (result) {
        res.redirect(`/user/${userResult._id}`)
         console.log(userResult.name)
      } else {
        res.send("Öyle Bir Kullanıcı Bulunamadı");
      }
    });
  });
 });
});

app.get("/user/:userId", async function (req, res) {
  let userId = req.params.id;
  User.findById(userId).then((result) => {
    Url.find({ userId:userId })
      .sort({ click:-1 })
      .then((urlResult) => {
          res.render(`${__dirname}/views/admin/user.ejs`, {
            url: urlResult,
            link: `https://${req.headers.host}/`,
            click:urlResult.click
          });
      });
  });
});

app.post("/new/url", async function (req, res) {
  let userId = req.params.id;
  let url = new Url({
    url: req.body.url,
    userId: req.params.id,
  });
  url.save().then((result) => {
  User.findOne({ id:req.params.id }).then((userResult)=>{
  //  res.redirect(`/user/${userResult._id}`)
    res.send(`
    Url'n <a href="https://${req.headers.host}/${result.short}">Tıkla</a>
    `)
   });
  });
 });


app.get('/:short',async function(req,res){
  let short = await Url.findOne({ short:req.params.short })
  if(short == null) return res.sendStatus(404)
  short.click++
  short.save()
  res.redirect(short.url)
})
