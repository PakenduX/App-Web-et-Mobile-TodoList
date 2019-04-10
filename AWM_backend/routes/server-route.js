let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let bcrypt = require('bcrypt');
let router = express.Router();
let { check, validationResult } = require('express-validator/check');
let User = require('../model/User');
let Todos = require('../model/Todos');
let TodoGroup = require('../model/TodoGroup');
let session = require('express-session');
let cors = require('cors');
require('../model/mongoConnect');

router.use(logger('dev'));
router.use(bodyParser.urlencoded({'extended': 'true'}));
router.use(bodyParser.json());
router.use(bodyParser.json({type: 'application/vnd.api+json'}));
router.use(cookieParser());
router.use(session({
    secret: 'AWM_Backend',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

router.use(cors());
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



router.post('/signUp', [
  check('email').isEmail().withMessage('Entrez une adresse email valide'),
  check('nom').isAlpha().withMessage('Le nom ne doit contenir que des lettres'),
  check('prenom').isAlpha().withMessage('Le prenom ne doit contenir que des lettres'),
  check('password').isLength({ min: 6 }).withMessage('Votre mot de passe doit être de minimum 6 caractères'),

], (req, res) => {
  let nom = req.body.nom;
  let prenom = req.body.prenom;
  let email = req.body.email;

  let errors = validationResult(req);

  if (!errors.isEmpty())
    return res.json({ errors: errors.array() });
  else{
      let password = bcrypt.hashSync(req.body.password, 10);
      let user = new User({
      nom: nom,
      prenom: prenom,
      email: email,
      password: password
    });

    user.save()
        .then(response => {
            res.json({
                'status': 'success',
                'message': 'L\'utilisateur a été bien créé'
            });
        })
        .catch(error => {
          res.json(error);
        });
  }
});

router.post('/signIn', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({
        email: email
    })
        .then(user => {
            if(!user)
                res.json({
                   'status' : 'error',
                   'message' : 'Cet utilisateur n\'existe pas'
                });
            bcrypt.compare(password, user.password)
                .then(response => {
                   if(response)
                       res.json({
                           'status' : 'success',
                           'message' : 'Bienvenue'
                       });
                   else
                       res.json({
                           'status' : 'error',
                           'message' : 'Email ou mot de passe incorrect'
                       });
                })
                .catch(error => {
                    res.json(error);
                });
        })
        .catch(error => {
            res.json(error);
        });
});

router.post('/todo/create/:owner/:group', (req, res) => {

  new Todos({
    text: req.body.text,
    group: req.params.group,
    date: new Date(),
    owner: req.params.owner,
    done: false,
  })
      .save()
      .then(response => {
        res.send({
          'status' : 'success',
          'message' : 'Todo bien créé'
        });
      })
      .catch(error => {
        res.send(error);
      });

});

router.post('/todoGroup/create/:owner', (req, res) => {

    new TodoGroup({
        nom: req.body.nom,
        owner: req.params.owner,
        date: new Date(),
    })
        .save()
        .then(response => {
            res.send({
                'status' : 'success',
                'message' : 'TodoGroup bien créé'
            });
        })
        .catch(error => {
            res.send(error);
        });

});

router.get('/user/todoGroups/:owner', function(req, res) {

  TodoGroup.find({
    owner: req.params.owner
  })
      .then(response => {
          res.json(response);
      })
      .catch(error => {
          res.json(error);
      });
});

router.get('/todos/:todoGroup', function (req, res) {
    Todos.find({group: req.params.todoGroup})
        .then(resolve => {
            res.json(resolve);
        })
        .catch(error => {
            res.json(error);
        });
});

router.delete('/todo/delete/:id', (req, res) => {
   Todos.deleteOne({
       _id: req.params.id
   })
       .then(response => {
           res.json({
               'status' : 'success',
               'message' : 'Todo bien supprimé'
           });
       })
       .catch(error => {
           res.json(error);
       });
});

router.delete('/todoGroup/delete/:id', (req, res) => {
   TodoGroup.deleteOne({
       _id: req.params.id
   })
       .then(response => {

           Todos.deleteMany({
               group: req.params.id
           })
               .then(resolve => {
                   res.json({
                       'status' : 'success',
                       'message' : 'Ta liste de tâche a été bien supprimée ainsi que toutes ses tâches'
                   });
               })
               .catch(errors => {
                  res.json(errors);
               });

       })
       .catch(error => {
           res.json(error);
       });
});

router.put('/todo/update/:id', (req, res) => {

    Todos.findOne({
        _id: req.params.id
    })
        .then(todo => {
            console.log(todo);
            if (req.body.text !== undefined)
                todo.text = req.body.text;

            if (req.body.done !== undefined)
                todo.done = req.body.done;

            todo.save()
                .then(response => {
                    res.json({
                        'status': 'success',
                        'message': 'Todo bien mis à jour'
                    });
                })
                .catch(error => {
                    res.json(error);
                });
        })
        .catch(error => {
            res.json(error);
        });
});

router.get('/user/:email', function (req, res) {

  User.find({
      email: req.params.email
  })
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        res.json(error);
      });
});

module.exports = router;