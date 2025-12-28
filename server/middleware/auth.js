const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

const isCustomer = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'customer') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Customer role required.' });
};

const isAgent = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'agent') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Agent role required.' });
};

const isCustomerOrAgent = (req, res, next) => {
  if (req.session.user && (req.session.user.role === 'customer' || req.session.user.role === 'agent')) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied.' });
};

export {
  isAuthenticated,
  isCustomer,
  isAgent,
  isCustomerOrAgent
};