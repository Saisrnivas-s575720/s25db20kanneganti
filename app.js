// 🌐 Required Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

// 🔌 MongoDB + Mongoose Setup
const mongoose = require('mongoose');
const connectionString = process.env.MONGO_CON;

if (!connectionString) {
  console.error("❌ MONGO_CON is undefined. Check your .env file.");
  process.exit(1);
}

console.log("🔌 Attempting DB connection to:", connectionString);

// 🔄 Load Journal Model + Optional Seed Data
const Journal = require('./models/journal');

async function recreateDB() {
  await Journal.deleteMany();

  const journal1 = new Journal({ title: 'Day 1', content: 'Started my new journal app!', author: 'srinivas' });
  const journal2 = new Journal({ title: 'Day 2', content: 'Learning MongoDB and Express', author: 'srinivas' });
  const journal3 = new Journal({ title: 'Day 3', content: 'REST APIs are fun!', author: 'srinivas' });

  await journal1.save();
  await journal2.save();
  await journal3.save();

  console.log("✅ Journal seed data saved to DB!");
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas!');
    if (process.env.SEED_DB === 'true') {
      await recreateDB();
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 📂 Route Files
const indexRouter = require('./routes/index');
const journalsRouter = require('./routes/journals');
const gridRouter = require('./routes/grid');
const pickRouter = require('./routes/pick');
const resourceRouter = require('./routes/resource');

// 🚀 App Initialization
const app = express();

// 🖼️ View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ⚙️ Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🔁 Method Override for PUT/DELETE from forms
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// 💬 Flash Messages + Session
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
  secret: 'journalSecret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// 🌍 Global Template Variables
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.title = 'My Journal App'; // default fallback title
  next();
});

// 🛣️ Route Mounting
app.use('/', indexRouter);
app.use('/journals', journalsRouter);
app.use('/grid', gridRouter);
app.use('/pick', pickRouter);
app.use('/resource', resourceRouter);

// ❌ Catch All Unmatched Routes
app.all('*', (req, res, next) => {
  console.log(`🛑 Unmatched Request: ${req.method} ${req.originalUrl}`);
  next(createError(404));
});

// ⚠️ Global Error Handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
