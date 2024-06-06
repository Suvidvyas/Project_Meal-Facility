import React from 'react';

const EmailTemplate = ({ type, email, resetUrl, firstName, password }) => {
  let subject, heading, content;

  // Determine the content based on the type of email
  switch (type) {
    case 'resetPassword':
      subject = 'Password Reset Link';
      heading = 'Password Reset Link';
      content = (
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href={resetUrl} className="reset-link">Reset Password</a>
      );
      break;
    case 'passwordResetSuccess':
      subject = 'Password Reset Successful';
      heading = 'Password Reset Successful';
      content = (
        <p>Your password has been successfully reset.</p>
      );
      break;
    case 'addEmployee':
      subject = 'BookMyMeal Credentials';
      heading = `${firstName}'s Credentials for BookMyMeal App`;
      content = (
        <>
          <p>Your Email: {email}</p>
          <p>Password: <span className="password">{password}</span></p>
        </>
      );
      break;
    default:
      subject = '';
      heading = '';
      content = '';
  }

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{subject}</title>
        <style>
          {/* Add your CSS styles here */}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="logo">
            <img src="https://drive.google.com/uc?id=1sYp31ujYU-59lCA6asnPXbIpvdfEK08O" alt="Rishabh Software" />
          </div>
          <div className="content">
            <h2>{heading}</h2>
            {content}
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailTemplate;
