const Employee = require("../models/employee-model");
const Booking = require("../models/booking-model");
const bcrypt = require("bcryptjs");
// const sendEmail = require("../utils/sendEmail");
const { syncIndexes } = require("mongoose");
// const transporter = require("../utils/transporter"); 
require('dotenv').config();
const transporter = require('../utils/transporter');
const generateRandomPassword = require('../utils/generateRandomPassword');
const getNextEmpId = require('../utils/getNextEmpId');
const { getPasswordResetSuccessEmail, getPasswordResetLinkEmail, getAddEmployeeEmail } = require('../utils/sendEmail');
const { reset } = require("nodemon");
// const { isErrored } = require("nodemailer/lib/xoauth2");
// const { default: BookingList } = require("../../client/src/screens/BookingList");
const DisabledDate = require('../models/diableDate-model');
const jwt = require('jsonwebtoken');

// *------------------------
// Home Logic 
// *------------------------

const home = async (req, res) => {
    try {
        res
            .status(200)
            .send("Hello, Welcome to Home Page.");
    } catch (error) {
        res.status(400).send( { msg:"Page Not Found" } );
    }
};

module.exports.home = home;

// *------------------------
// AddEmployee Logic 
// *------------------------

const AddEmployee = async (req,res) => {
    try {
        // console.log("Hello world");
        console.log(req.body);
        const { firstName, lastName, email, phone, department, gender } = req.body;

         // generate random password
         const password = generateRandomPassword(10);
         console.log(password);
         // auto increment empid
 
         // encrypt password with bcryptjs
         const saltRound = await bcrypt.genSalt(10);
         const hashPassword = await bcrypt.hash( password, saltRound );


        const employeeExists = await Employee.findOne({ email });
        // const employeeExists = await Employee.findOne( { email } );
        
        // Employee is not exists in database 
        if(!employeeExists){
            
            const empId = await getNextEmpId();
            console.log(empId);
   
            const employeeCreated = await Employee.create( { 
                empId,
                firstName,
                lastName, 
                email, 
                phone, 
                department,
                gender,
                password: hashPassword 
            });
    
    
            try {
                await transporter.sendMail(getAddEmployeeEmail(email, firstName, password));
                res.status(200).json( 
                    { 
                        isError: false,
                        msg: "Registration Successfull!",
                        emailmsg:"Credentials will be Recevied on Your Email",
                        token: await employeeCreated.generateToken(),
                        userId: employeeCreated._id.toString() 
                    });
                  } catch (error) {
                console.error(error);
                res.status(500).send('Failed to Register Employee.');
              }
    
        }

        const employeeDeleted = await Employee.findOne({ email, isDelete: true });
        
        // if employee is previuosly registered and then deleted
        if(employeeDeleted){
            
            employeeUpdated = await Employee.findOneAndUpdate(
                { email },
                {
                  $set: {
                    isDelete: false,
                    phone,
                    department,
                    password: hashPassword
                  },
                },
                { new: true }
              );  

              try {
                await transporter.sendMail(getAddEmployeeEmail(email, firstName, password));
                res.status(200).json( 
                    { 
                        isError: false,
                        msg: "Registration Successfull!",
                        emailmsg:"Credentials will be Recevied on Your Email",
                        token: await employeeUpdated.generateToken(),
                        userId: employeeUpdated._id.toString() 
                    });
                  } catch (error) {
                console.error(error);
                res.status(500).send('Failed to Register Employee.');
              }          
            // return res.status(400).json( { msg: "Employee already exists." } );
        } 


        // res.status(200).send("This is SignUp Page.");
    } catch (error) {

        res.status(400).json( 
            { 
                isError: true,
                msg:"Page Not Found", 
                error: error.message
            });
    }
}

module.exports.AddEmployee = AddEmployee;


// *------------------------
// Delete User List Logic 
// *------------------------

const deleteEmployee = async (req, res) => {
    try {
      const { email, empId } = req.body;
  
      const employeeExists = await Employee.findOneAndUpdate(
        { email },
        { $set: { isDelete: true } },
        { new: true }
      );

      if(employeeExists){
        await Booking.updateMany(
            { employees: { $elemMatch: { empId } } },
            { $set: { isDelete: true } }
          );      
      }

      if (!employeeExists) {
        return res.status(404).json({ msg: 'Employee not found' });
      }
  
      res.status(200).json({ msg: 'Employee Deleted Successfully' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
  
  module.exports.deleteEmployee = deleteEmployee;

// *------------------------
// Login Logic 
// *------------------------

const signIn = async (req,res) => {
    try {
        const { email, password } = req.body;

        const employeeExists = await Employee.findOne( { email: email } );

        if(!employeeExists) {
            res.status(200).send( { msg: "Employee not exists." } );
        }
        
        // const employeePassword = await Employee.findOne( { password: password } );
        const passwordMatch = await bcrypt.compare( password, employeeExists.password );

        // const employeePassword = await Employee.findOne( { password: password } );
        // console.log(employeeEmail);
        // console.log(employeePassword);

        if(passwordMatch && employeeExists.isAdmin) {
            res.status(200).json(
                {
                    isError: false,
                    msg: "Login Successfull",
                    token: await employeeExists.generateToken(),
                    userId: employeeExists._id.toString()
                });
            // res.status(200).json( { msg: "Signin Successfull." } );
        } else {
            res.status(400).json( { msg: "Error" } );
        }

        // res.status(200).send("This is Signin Page.");
    } catch (error) {
        res.status(400).send( { msg:"Page Not Found" } );
    }
}

module.exports.signIn = signIn;

// *------------------------
// Forgot Password Logic 
// *------------------------

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        // res.json({ msg: "Sending Mail"});
        if(!email){
          return res.status(404).json( { msg: "Email is required." } );
        }

        const employeeExists = await Employee.findOne( { email } );
        if(!employeeExists){
            return res.status(404).json( { msg: "Employee does not exists!" } );
        }
        
        const resetUrl = `http://localhost:3000/resetpassword?email=${email}`;

        try {
            sendEmail(getPasswordResetLinkEmail(email, resetUrl));
            res.status(200).json('Password reset link sent successfully!' + `${resetUrl}`);
          } catch (error) {
            console.error(error);
            res.status(500).send('Failed to send password reset link.');
          }

    } catch (error) {
        res.status(400).json({ error:error.message});
    }
}

module.exports.forgotpassword = forgotpassword;

// *------------------------
// Reset Password Logic 
// *------------------------

const resetPassword = async (req, res) => {
  
  try{
    const { newPassword } = req.body;
    const email = req.query.email;

    const employeeExists = await Employee.findOne( { email } );

    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, saltRound);
    
    employeeExists.password = hashPassword;
    await employeeExists.save();

    try {
        sendEmail(getPasswordResetSuccessEmail(email));
        res.status(200).json({
                isError: false,
                msg: 'Password reset successful.',
                token: await employeeExists.generateToken(),
                userId: employeeExists._id.toString()
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to send email.');
        }

    } catch (error) {
        res.status(400).json({
            isError: true,
            msg: 'Failed to reset password.',
            error: error.message
        });
    }
  };
  
module.exports.resetPassword = resetPassword;
// const resetPassword = async (req,res) => {
//     try {
//         const email = req.body;
    
//         if (!email) {
//           return res.status(400).json({ msg: "Email is required." });
//         }
    
//         const employeeExists = await Employee.findOne({ email: email });
    
//         if (!employeeExists) {
//           return res.status(404).json({ msg: "Employee not found." });
//         }

//         const resetUrl = `http://localhost:3000/resetpassword?email=${email}`;

//         // Email content
//         const mailOptions = {
//             from: process.env.EMAIL_FROM,
//             to: email,
//             subject: 'Password Reset Link',
//             html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
//         };

//         try {
//             await transporter.sendMail(mailOptions);
//             res.status(200).json('Password reset link sent successfully!' + `${resetUrl}`);
//           } catch (error) {
//             console.error(error);
//             res.status(500).send('Failed to send password reset link.');
//           }
        
        // // encrypt password with bcryptjs
        // const saltRound = await bcrypt.genSalt(10);
        // const hashPassword = await bcrypt.hash( newPassword, saltRound );

        // // Employee.updateOne({ email: email }, { $set: { password: newPassword } });
        // employeeExists.password = hashPassword;
        // employeeExists.save();
    
        // const checkPassword = await Employee.findOne( { email: email, password: hashPassword } );
    
        // if (!checkPassword) {
        //   return res.status(500).json({ msg: "Password update failed." });
        // }else{
        //     return res.status(500).json({ msg: "Password updated Successfully." });
        // }
                
//         }

//      catch (error) {
//         res.status(400).json(error);
//     }
// }
// module.exports.resetPassword = resetPassword;


// *------------------------
// User List Logic 
// *------------------------

const userList = async (req, res) => {
    try {
      const employees = await Employee.find({ isDelete: { $ne: true } });
      res.json(employees);
    } catch (error) {
      res.status(404).json(error);
    }
  };
  
  module.exports.userList = userList;

// *------------------------
// Add Booking Logic 
// *------------------------

const AddBooking = async (req, res) => {
    const { category, mealType, startDate, endDate, dates, employees, notes, bookingCount, bookingName } = req.body;
    console.log(req.body);

    try {
        if(category === 'employee') {
            if (!category || !mealType || !startDate || !endDate || !employees || dates.length === 0 || employees.length === 0) {
                return res.status(400).json({ msg: "Insufficient data provided for employee booking." });
            } else {
                for (let i = 0; i < employees.length; i++) {
                    const employee = employees[i];
                    const bookingData = {
                        category,
                        mealType,
                        startDate,
                        endDate,
                        dates,
                        employees: [{
                            empId: employee.empId,
                            firstName: employee.firstName,
                            lastName: employee.lastName,
                            department: employee.department
                        }],
                        notes,
                        bookingCount,
                        bookingName
                    };

                    const bookingCreated = await Booking.create(bookingData);
                    console.log(`Booking created for ${employee.firstName} ${employee.lastName}`);
                }

                res.status(200).json({ msg: "Employee bookings successful." });
            }
        } else if(category === 'nonEmployee' || category === 'customBooking') {
            if (!category || !mealType || !startDate || !endDate || dates.length === 0 || !notes || !bookingCount) {
                return res.status(400).json({ msg: "Insufficient data provided for non-employee or custom booking." });
            } else {
                const bookingData = {
                    category,
                    mealType,
                    startDate,
                    endDate,
                    dates,
                    employees: [],
                    notes,
                    bookingCount,
                    bookingName
                };

                const bookingCreated = await Booking.create(bookingData);

                res.status(200).json({ msg: "Non-employee or custom booking successful." });
            }
        } else {
            return res.status(400).json({ msg: "Invalid category provided." });
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ msg: "Failed to create booking.", error });
    }
};

module.exports.AddBooking = AddBooking;

// *------------------------
// Booking List Logic 
// *------------------------

const bookingList = async (req, res) => {
    try {
        const bookings = await Booking.find({ isDelete: false });
  
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
};
  
module.exports.bookingList = bookingList;

// const bookingList = async (req, res) => {
//     try {
//         const bookings = await Booking.find( { isDelete: false } );
//         res.json(bookings);
//     } catch (error) {
//         console.error('Error fetching bookings:', error);
//         res.status(500).json({ error: 'Failed to fetch bookings.' });
//     }
// };

// module.exports.bookingList = bookingList;

// *------------------------
// Booking List Logic 
// *------------------------

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      { _id: bookingId },
      { $set: { isDelete: true } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.status(200).json({ msg: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports.deleteBooking = deleteBooking;

// *------------------------
// Add Diable Dates List Logic 
// *------------------------

const addDisabledDates = async (req, res) => {
    try {
      const { dates, reason } = req.body;
  
      if (!dates || !reason) {
        return res.status(400).json({ error: 'Dates and reason are required.' });
      }
  
      const newDisabledDate = new DisabledDate({
        dates,
        reason
      });
  
      await newDisabledDate.save();
  
      res.status(201).json({ msg: 'Dates Diabled Successfully', newDisabledDate });
    } catch (error) {
      console.error('Error adding disabled date:', error);
      res.status(500).json({ error: 'Failed to add disabled date.' });
    }
  };
  
  module.exports.addDisabledDates = addDisabledDates;

// *------------------------
// Diable Dates List Logic 
// *------------------------

const DisabledDates = async (req, res) => {
    try {
      const disabledDates = await DisabledDate.find().sort({ createdAt: -1 });
      res.status(200).json(disabledDates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching disabled dates', error });
    }
  }
  
  module.exports.DisabledDates = DisabledDates;
 
// *------------------------
// Change Password Logic 
// *------------------------

  const ChangePassword = async (req, res) => {
    const { oldPassword, newPassword} = req.body;
  
    try {
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const email = decodedToken.email;
        
      const employeeExists = await Employee.findOne( { email: email } );

      if(!employeeExists) {
          res.status(200).send( { msg: "Employee not exists." } );
      }

      const passwordMatch = await bcrypt.compare( oldPassword, employeeExists.password );

      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid old password.' });
      }
  
      const saltRound = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash( newPassword, saltRound );

      employeeExists.password = hashPassword;
      await employeeExists.save();
  
      await transporter.sendMail(getPasswordResetSuccessEmail(email));
      res.status(200).json({ msg: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password.' });
    }
  };
  
  module.exports.ChangePassword = ChangePassword;
  