const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, ''));
app.set('view engine', 'ejs');

const MASTER_USERNAME = 'admin';
const MASTER_PASSWORD = 'admin1234';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.use('/api/auth', auth_router);
app.use('/api/inventory', inventory_router);

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === MASTER_USERNAME && password === MASTER_PASSWORD) {
    req.session.isMaster = true;
    res.redirect('/');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.post('/addItem', async (req, res) => {
  try {
    const { itemName, itemQuantity, itemPrice, status, image } = req.body;
    const newItem = new InventoryItem({
      itemName,
      itemQuantity,
      itemPrice,
      status,
      image
    });
    
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).send('Error adding new item');
  }
});

app.post('/editItem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, itemQuantity, itemPrice, status, image } = req.body;

    const updatedItem = await InventoryItem.findByIdAndUpdate(id, {
      itemName,
      itemQuantity,
      itemPrice,
      status,
      image
    }, { new: true });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).send('Error updating item');
  }
});

app.post('/changeStatus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedItem = await InventoryItem.findByIdAndUpdate(id, {
      status
    }, { new: true });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).send('Error changing item status');
  }
});

app.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.render('index', { 
      items, 
      isMaster: req.session.isMaster  
    });
  } catch (error) {
    res.status(500).send('Error fetching inventory items');
  }
});

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});