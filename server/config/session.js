import MongoStore from 'connect-mongo';

const createSessionConfig = () => {
  const sessionSecret = process.env.SESSION_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!process.env.SESSION_SECRET) {
    console.warn('SESSION_SECRET not found in environment variables');
  }
  
  console.log('Session config  Production:', isProduction);
  
  return {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60 
    }),
    cookie: {
      secure: isProduction, 
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24, 
      sameSite:  'none' 
    },
    name: 'connect.sid', 
    proxy: isProduction 
  };
};

export default createSessionConfig;