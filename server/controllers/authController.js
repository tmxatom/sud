import User from '../models/User.js';

const register = async (req, res) => {
  try {
    const { name, email, password, phone, policyNumber, role = 'customer' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const userData = { name, email, password, phone, role };
    if (role === 'customer' && policyNumber) {
      userData.policyNumber = policyNumber;
    }

    const user = new User(userData);
    await user.save();

    // Create session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      policyNumber: user.policyNumber,
      notificationToken: user.notificationToken
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        policyNumber: user.policyNumber,
        notificationToken: user.notificationToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      policyNumber: user.policyNumber,
      notificationToken: user.notificationToken
    };

    // Save session explicitly and wait for it
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          reject(err);
        } else {
          console.log('Session saved successfully:', req.sessionID);
          resolve();
        }
      });
    });

    console.log('Login successful for:', email, 'Session ID:', req.sessionID);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        policyNumber: user.policyNumber,
        notificationToken: user.notificationToken
      },
      sessionId: req.sessionID // Add session ID for debugging
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('sessionId'); // Use the custom session name
    res.json({ message: 'Logout successful' });
  });
};

const checkSession = (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
};

const getMe = (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

const updateNotificationToken = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Update user's notification token in database
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { notificationToken: token },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update session with new token info
    req.session.user.notificationToken = token;

    res.json({
      message: 'Notification token updated successfully',
      token: token
    });
  } catch (error) {
    console.error('Update notification token error:', error);
    res.status(500).json({ message: 'Server error updating notification token' });
  }
};

export {
  register,
  login,
  logout,
  checkSession,
  getMe,
  updateNotificationToken
};