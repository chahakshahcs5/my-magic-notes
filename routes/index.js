const express = require('express');

const router = express.Router();

const Note = require('../models/notes');

router.post('/add-notes', (req,res) => {
    const title = req.body.title;
    const description = req.body.description;
    const user_id = req.body.user_id;

    const note = new Note({title: title, description: description, user_id: user_id});
    note.save()
    .then(result => {
        res.redirect(`/home/${user_id}`)
    })    
    .catch(err => {
        console.log(err);
    }) 
});

// router.get('/home', (req,res) => {
//     Note.find()
//     .then(notes => {
//         res.render('home', {
//             pageTitle: 'home',
//             notes: notes ,
//             path: '/home'      
//         });
//     });
// });

router.get('/home/:user_id', (req,res) => {
    if(req.session.isLoggedin){
        const user_id = req.params.user_id;
        Note.find({user_id: user_id})
        .then(notes => {
            res.render('home', {
             pageTitle: 'home',
             path: '/home/user',
             user_id: user_id,
             notes: notes,
             isLoggedin: true        
            })
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        res.redirect('/login')
    }
    
});

router.post('/logout', (req,res) => {
    req.session.destroy((err => {
        res.redirect('/');
        console.log(err);
    }));
    
});


router.post('/delete-note', (req,res) => {
    const noteId = req.body.noteId;
    const user_id = req.body.user_id;
    Note.findByIdAndRemove(noteId, {
        useFindAndModify: false
    })
    .then(result => {
        res.redirect(`/home/${user_id}`);
    });  
});

module.exports = router;