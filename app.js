// Required Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // Load environment variables

// MongoDB + Mongoose Setup
const mongoose = require('mongoose');
const connectionString = process.env.MONGO_CON;

if (!connectionString) {
  console.error("❌ MONGO_CON is undefined. Check your .env file.");
  process.exit(1);
}

console.log("🔌 Attempting DB connection to:", connectionString);

mongoose.connect(connectionString)
  .then(() => console.log('✅ Connection to MongoDB Atlas succeeded!'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Load Models
const Costume = require('./models/costume');

// Optional: Seed data
async function recreateDB() {
  await Costume.deleteMany();

  const costume1 = new Costume({ costume_type: 'Vampire', size: 'L', cost: 25 });
  const costume2 = new Costume({ costume_type: 'Witch', size: 'M', cost: 20 });
  const costume3 = new Costume({ costume_type: 'Pirate', size: 'S', cost: 15 });

  await costume1.save();
  await costume2.save();
  await costume3.save();

  console.log("✅ Costume seed data saved to DB!");
}

// 🔁 Run this ONCE to seed, then comment it out
// recreateDB();

// Route Files
const indexRouter = require('./routes/index');
const journalsRouter = require('./routes/journals');
const gridRouter = require('./routes/grid');
const pickRouter = require('./routes/pick');

const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/journals', journalsRouter);
app.use('/grid', gridRouter);
app.use('/pick', pickRouter);

// Catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

