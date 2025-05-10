// 🌐 Required Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

// 🔐 Security
const helmet = require('helmet');

// 🔌 MongoDB + Mongoose
const mongoose = require('mongoose');
const connectionString = process.env.MONGO_CON;

if (!connectionString) {
  console.error("❌ MONGO_CON is undefined. Check your .env file.");
  process.exit(1);
}

console.log("🔌 Attempting DB connection to:", connectionString);

// 🔄 Load Models
const Journal = require('./models/journal');
const Account = require('./models/account');

// ✅ Seed DB
async function recreateDB() {
  try {
    await Journal.deleteMany();

    let author = await Account.findOne({ username: 'srinivas' });
    if (!author) {
      author = new Account({ username: 'srinivas' });
      await Account.register(author, 'test123');
      console.log("✅ Created seed user 'srinivas'");
    }

    const entries = [
      { title: 'Day 1', content: 'Started my new journal app!', author: author._id },
      { title: 'Day 2', content: 'Learning MongoDB and Express', author: author._id },
      { title: 'Day 3', content: 'REST APIs are fun!', author: author._id }
    ];

    await Journal.insertMany(entries);
    console.log("✅ Journal seed data saved to DB!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

// 🌍 DB Connect
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB Atlas!');
  if (process.env.SEED_DB === 'true') {
    await recreateDB();
  }
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// 🚀 Express App
const app = express();

// 🛡 Helmet
app.use(helmet());

// 🖼️ Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ⚙️ Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🔁 Method Override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// 💬 Session + Flash
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
  secret: 'journalSecret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// 🔑 Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// 🌍 Local Variables for Views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.title = 'My Journal App';
  res.locals.currentUser = req.user;
  next();
});

// 🛣️ Routes
const indexRouter = require('./routes/index');
const journalsRouter = require('./routes/journals');
const gridRouter = require('./routes/grid');
const pickRouter = require('./routes/pick');
const resourceRouter = require('./routes/resource');
const authRouter = require('./routes/auth'); // 🔐 Logout route

app.use('/', indexRouter);
app.use('/journals', journalsRouter);
app.use('/grid', gridRouter);
app.use('/pick', pickRouter);
app.use('/resource', resourceRouter);
app.use('/', authRouter); // ✅ mounts /logout

// ❌ 404 Handler
app.all('*', (req, res, next) => {
  console.warn(`🛑 Unmatched route: ${req.method} ${req.originalUrl}`);
  next(createError(404));
});

// ⚠️ Error Renderer
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// Compare this snippet from routes/journals.js:
// const express = require('express');  