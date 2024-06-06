const getPasswordResetSuccessEmail = (email) => {
    return {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Successful',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
      </head>
      <body>
          <div class="container">
              <div class="logo">
                  <img src="https://drive.google.com/uc?id=1sYp31ujYU-59lCA6asnPXbIpvdfEK08O" alt="Rishabh Software">
              </div>
              <div class="content">
                  <h2>Password Reset Successful.</h2>
              </div>
          </div>
      </body>
      </html>`
    };
  };
  
  const getPasswordResetLinkEmail = (email, resetUrl) => {
    return {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Link',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Link</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .logo {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .logo img {
                  max-width: 200px;
              }
              .content {
                  background-color: #f5f5f5;
                  padding: 20px;
                  border-radius: 5px;
              }
              .reset-link {
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  display: inline-block;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="logo">
                  <img src="https://drive.google.com/uc?id=1sYp31ujYU-59lCA6asnPXbIpvdfEK08O" alt="Rishabh Software">
              </div>
              <div class="content">
                  <h2>Password Reset Link</h2>
                  <p>You requested a password reset. Click the button below to reset your password:</p>
                  <a href="${resetUrl}" class="reset-link">Reset Password</a>
              </div>
          </div>
      </body>
      </html>`
    };
  };
  
  const getAddEmployeeEmail = (email, firstName, password) => {
    return {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'BookMyMeal Credentials',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .logo {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .logo img {
                  max-width: 200px;
              }
              .content {
                  padding: 20px;
              }
              .password {
                  color: blue;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="logo">
                  <img src="https://drive.google.com/uc?id=1sYp31ujYU-59lCA6asnPXbIpvdfEK08O" alt="Rishabh Software">
              </div>
              <div class="content">
                  <h2>${firstName}'s Credentials for BookMyMeal App</h2>
                  <p>Your Email: ${email}</p>
                  <p>Password: <a class="password">${password}</a></p>
              </div>
          </div>
      </body>
      </html>`
    };
  };
  
  module.exports = {
    getPasswordResetSuccessEmail,
    getPasswordResetLinkEmail,
    getAddEmployeeEmail
  };
  