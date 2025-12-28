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
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-origin cookies in production
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined // Allow cookies across Vercel subdomains
  },
  name: 'sessionId' // Custom session name
});

export default createSessionConfig;