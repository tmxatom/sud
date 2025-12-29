import MongoStore from 'connect-mongo';

const createSessionConfig = () => {
  const sessionSecret = process.env.SESSION_SECRET || 'fallback-secret-key-for-development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!process.env.SESSION_SECRET) {
    console.warn('SESSION_SECRET not found in environment variables, using fallback');
  }
  
  console.log('Session config - Production:', isProduction);
  
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
      secure: isProduction, // Only secure in production (HTTPS)
      httpOnly: false, // Allow JavaScript access for debugging
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production, 'lax' for local
    },
    name: 'connect.sid', // Use default session name
    proxy: isProduction // Only trust proxy in production
  };
};

export default createSessionConfig;