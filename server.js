const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth_router = require('./authorisation');
const inventory_router = require('./inventory');
const User = require('./userLogin');
const path = require('path');
const InventoryItem = require('./inventory_item');

dotenv.config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        const new_user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
        });
        new_user.save().then(() => done(null, new_user));
      } else {
        return done(null, user);
      }
    });
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.use('/api/auth', auth_router);
app.use('/api/inventory', inventory_router);

app.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.render('index', { items });
  } catch (error) {
    res.status(500).send('Error fetching inventory items');
  }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
