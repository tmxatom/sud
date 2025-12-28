import MongoStore from 'connect-mongo';

const createSessionConfig = () => ({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: false, // Temporarily disable for testing
    httpOnly: false, // Allow JavaScript access to cookies for debugging
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'none', // Allow cross-origin cookies
  },
  name: 'sessionId'
});

export default createSessionConfig;