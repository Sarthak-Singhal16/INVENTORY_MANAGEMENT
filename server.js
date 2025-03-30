const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./authorisation');
const inventoryRouter = require('./inventory');

const dotenv = require('dotenv');
dotenv.config(); 


const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
