import MongoStore from 'connect-mongo';

const createSessionConfig = () => {
  const sessionSecret = process.env.SESSION_SECRET || 'fallback-secret-key-for-development';
  
  if (!process.env.SESSION_SECRET) {
    console.warn('SESSION_SECRET not found in environment variables, using fallback');
  }
  
  return {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
      secure: true, // Always use secure cookies for HTTPS
      httpOnly: false, // Allow JavaScript access for debugging
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'none', // Required for cross-origin cookies
    },
    name: 'connect.sid', // Use default session name
    proxy: true // Trust proxy (required for Vercel)
  };
};

export default createSessionConfig;