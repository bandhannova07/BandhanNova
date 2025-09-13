const nodemailer = require('nodemailer');

/**
 * Send Email Utility
 * Handles email sending for various purposes like verification, password reset, etc.
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'bandhannova@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Email templates
const emailTemplates = {
  verification: (name, verificationUrl) => ({
    subject: 'Verify Your BandhanNova Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0066ff, #00ffff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">BandhanNova</h1>
          <p style="color: white; margin: 5px 0;">Innovating Tomorrow, Today</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Welcome to BandhanNova, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining our community. To complete your registration and start exploring our services, please verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: #0066ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #0066ff;">${verificationUrl}</a>
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours for security reasons.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p>© 2024 BandhanNova. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Reset Your BandhanNova Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0066ff, #00ffff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">BandhanNova</h1>
          <p style="color: white; margin: 5px 0;">Password Reset Request</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${name}, we received a request to reset your password. Click the button below to create a new password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #0066ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p>© 2024 BandhanNova. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  welcome: (name) => ({
    subject: 'Welcome to BandhanNova!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0066ff, #00ffff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">BandhanNova</h1>
          <p style="color: white; margin: 5px 0;">Welcome to the Future</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Welcome aboard, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Your email has been verified successfully! You're now part of the BandhanNova community.
          </p>
          <h3 style="color: #333;">What's Next?</h3>
          <ul style="color: #666; line-height: 1.8;">
            <li>Explore our AI Tools and boost your productivity</li>
            <li>Join our Community Hub and connect with developers worldwide</li>
            <li>Check out our Freelance Lab for project opportunities</li>
            <li>Stay updated with the latest Tech News</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="background: #0066ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Exploring
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p>© 2024 BandhanNova. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

/**
 * Send verification email
 */
const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    const template = emailTemplates.verification(name, verificationUrl);

    const mailOptions = {
      from: `"BandhanNova" <${process.env.EMAIL_USER || 'bandhannova@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const template = emailTemplates.passwordReset(name, resetUrl);

    const mailOptions = {
      from: `"BandhanNova" <${process.env.EMAIL_USER || 'bandhannova@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.welcome(name);

    const mailOptions = {
      from: `"BandhanNova" <${process.env.EMAIL_USER || 'bandhannova@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send custom email
 */
const sendCustomEmail = async (to, subject, html, text = null) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"BandhanNova" <${process.env.EMAIL_USER || 'bandhannova@gmail.com'}>`,
      to,
      subject,
      html,
      text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Custom email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending custom email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendCustomEmail
};
