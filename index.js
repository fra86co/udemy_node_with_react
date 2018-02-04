const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
require('./services/passport');
const passport = require('passport')
const authRoutes = require('./routes/authRoutes');


mongoose.connect(keys.mongoURI)


const app = express();

app.use(passport.initialize());
app.use(passport.session());


authRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
