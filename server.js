const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const fs = require('fs');

const path = require('path');

const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const mongoose = require('mongoose');

const express = require('express');

const app = express();

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);

const helmet = require('helmet');

const compression = require('compression');

const morgan = require('morgan');

const csrf = require('csurf');

const flash = require('connect-flash');

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use('/', express.static(__dirname + '/static/'));

app.use(session({secret: 'chahak', store: store, resave: true, saveUninitialized: true}));

const csrfProtection = csrf();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    { flags: 'a'}
    );
    
app.use(csrfProtection);

app.use((req,res,next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(helmet());

app.use(compression());

app.use(morgan('combined', { stream: accessLogStream}));

app.use(flash());

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
    app.listen(PORT);
})
.catch(err => {
    console.log(err);
});

app.use(userRouter);
app.use(indexRouter);
