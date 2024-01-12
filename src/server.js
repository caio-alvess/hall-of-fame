const express = require('express');
const path = require('node:path');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis').default;
const globalErrorHanlder = require('./controllers/error.controller.js');

const redisClient = redis.createClient();

redisClient.connect().catch((e) => console.error(e));

//import routes
const indexRoutes = require('./routes/index.routes');
const apiRoutes = require('./routes/api.routes');
const emailRoutes = require('./routes/email.routes');
const authRoutes = require('./routes/authenticator.routes');
const formRoutes = require('./routes/form.routes');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(session({
    store: new redisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.set('views', path.resolve(__dirname, '../', 'views'))
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


//routes
app.use(indexRoutes)
app.use(formRoutes);
app.use(apiRoutes);
app.use(emailRoutes);
app.use(authRoutes);


app.all('*', globalErrorHanlder);
app.listen(3000, () => console.log('running on http://localhost:3000/'));