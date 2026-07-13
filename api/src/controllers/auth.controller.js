const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and password required',
        },
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    await user.update({ last_login_at: new Date() });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        system_role: user.system_role,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 86400,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: error.message,
      },
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, name, password, system_role } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email, name, and password required',
        },
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password_hash: hashedPassword,
      system_role: system_role || 'student',
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        system_role: user.system_role,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 86400,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTER_ERROR',
        message: error.message,
      },
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: error.message,
      },
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_ERROR',
        message: error.message,
      },
    });
  }
};

exports.getGoogleAuthUrl = (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = 'http://localhost:5175/auth/google/callback';
    const scope = 'openid profile email';
    const responseType = 'code';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    res.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GOOGLE_AUTH_ERROR',
        message: error.message,
      },
    });
  }
};

const detectRoleFromEmail = (email) => {
  const localPart = email.split('@')[0];
  const isRegistrationNumber = /^\d+$/.test(localPart);

  if (isRegistrationNumber) {
    return 'student';
  }

  return 'faculty';
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Google token is required',
        },
      });
    }

    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      console.error('Token verification failed:', {
        error: verifyError.message,
        clientId: process.env.GOOGLE_CLIENT_ID,
        tokenLength: token.length,
      });
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid Google token: ' + verifyError.message,
        },
      });
    }

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    console.log('Google login attempt:', { email, tokenExpiry: payload.exp });

    const allowedDomains = ['cutm.ac.in', 'cutmap.ac.in', 'thegttech.com', 'esse.co.in', 'ftl.org.in'];
    const emailDomain = email.split('@')[1];

    if (!allowedDomains.includes(emailDomain)) {
      console.log('Domain rejected:', { email, domain: emailDomain });
      return res.status(403).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL_DOMAIN',
          message: 'Email domain not authorized. Allowed: @cutm.ac.in, @cutmap.ac.in, @thegttech.com, @esse.co.in, @ftl.org.in',
        },
      });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const systemRole = detectRoleFromEmail(email);
      user = await User.create({
        email,
        name,
        system_role: systemRole,
        is_active: true,
      });
      console.log('New user created:', { email, role: systemRole });
    } else {
      await user.update({ last_login_at: new Date() });
      console.log('Existing user logged in:', { email });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          system_role: user.system_role,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 86400,
        },
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GOOGLE_LOGIN_ERROR',
        message: error.message,
      },
    });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CODE',
          message: 'Authorization code is required',
        },
      });
    }

    res.json({
      success: true,
      message: 'Google OAuth callback received. Exchange code for tokens in frontend.',
      code,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GOOGLE_CALLBACK_ERROR',
        message: error.message,
      },
    });
  }
};
