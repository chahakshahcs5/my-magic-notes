const User = require("../models/users");

const express = require("express");

const bcrypt = require("bcryptjs");

const crypto = require('crypto');

const router = express.Router();

const nodemailer = require('nodemailer');

const sendgridTransport = require('nodemailer-sendgrid-transport');
const { use } = require(".");

const trasporter = nodemailer.createTransport(sendgridTransport({
    auth: {
      api_key: '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'
    }
}));

router.get("/", (req, res) => {
  let message = req.flash("data");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("index", {
    pageTitle: "Welcome",
    path: "/index",
    isLoggedin: false,
    errorMessage: message
  });
});

router.post("/login", (req, res) => {
  res.redirect("login");
});

router.get("/login", (req, res) => {
  let message = req.flash("data");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login", {
    pageTitle: "Login",
    path: "/login",
    isLoggedin: false,
    errorMessage: message,
  });
});

router.post("/register", (req, res) => {
  res.redirect("register");
});

router.get("/register", (req, res) => {
  let message = req.flash("data");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("register", {
    pageTitle: "Register",
    path: "/register",
    isLoggedin: false,
    errorMessage: message
  });
});

router.get("/reset-password", (req,res) => {
  let message = req.flash("data");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('reset-password',{
    pageTitle: 'Reset Password',
    path: '/reset-password',
    isLoggedin: false,
    errorMessage: message
  })
});

router.post("/reset", (req,res) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err,buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('reset-password');
    }
    const token = buffer.toString('hex');
    User.findOne({email: email})
      .then(user => {
        if(!user) {
          req.flash('data', 'no user found with this email!')
          return res.redirect('/reset-password')
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      }).then(result => {
          res.redirect('/')
          req.flash('data', 'reset link has been sent to your mail!')
          trasporter.sendMail({
          to: email,
          from: 'magicnotes@telegmail.com',
          subject: 'Reset Password',
          html: `<h1>You requsted for a password reset <a href="http://localhost:3000/reset/${token}">Click here</a> to reset password</h1>`
        })
      })
      .catch(err => {
        console.log(err);
      })
  })
});

router.post("/update-password", (req,res) => {
  const token = req.body.token;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  let resetUser;
  console.log(token);
  if(newPassword == confirmPassword){
    User.findOne({
      resetToken: token, resetTokenExpiration: {$gt: Date.now()}
    })
    .then(user => {
      if(!user) {
        return res.redirect('/');
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = null;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        res.redirect('/login');
        req.flash('data', 'password successfully updated!');
      })
    })
    .catch(err => {
      console.log(err);
    })
  } else {
    res.redirect(`/reset/${token}`)
    req.flash('data', 'password does not match')
    console.log(token);
  }
  
});

router.get('/reset/:token', (req,res) => {
  let message = req.flash("data");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const token = req.params.token;
  console.log(token);
  User.findOne({
    resetToken: token, resetTokenExpiration: {$gt: Date.now()}
  })
  .then(user => {
    if(user) {
    res.render('update-password', {
      token: token,
      path: '/update-password',
      pageTitle: 'update-password',
      isLoggedin: false,
      errorMessage: message,
    })
  } else {
    res.redirect('/');
  }
  })
  .catch(err => {
    console.log(err);
  })
});


router.post("/add-user", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password == confirmPassword) {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        req.flash("data", "E-mail already exists!");
        res.redirect("register");
      } else {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            user = new User({
              name: name,
              email: email,
              password: hashedPassword,
            });
            user
              .save()
              .then((result) => {
                res.redirect("login");
                req.flash("data", "Successfully Signed Up!");
                return trasporter.sendMail({
                  to: email,
                  from: 'magicnotes@telegmail.com',
                  subject: 'Signup',
                  html: `<h1>You Successfully Signed Up! <a href="http://localhost:3000/login">Click here</a> to log in</h1>`
                })
                .catch(err => {
                  console.log(err);
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } else {
    req.flash('data', 'Password does not match!')
    res.redirect("register");
  }
});

router.post("/user-login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              const user_id = user._id;
              console.log(user);
              req.session.isLoggedin = true;
              res.redirect(`home/${user_id}`);
            } else {
               req.flash(
                "data",
                "E-mail or password does not match!"
              );
              return res.redirect("/login");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        req.flash("data", "E-mail or password does not match!");
       return res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
