const express = require('express');
const router = express.Router();
// import {home, login, signup} from '../controller/auth-controller';
const authControllers = require("../controllers/auth-controllers");
const { verifyToken } = require('../utils/verifyToken');

router.route("/").get(authControllers.home);

router.route("/addemployee").post(authControllers.AddEmployee);

router.route("/signin").post(authControllers.signIn);

// router.route("/forgotpassword").post(authControllers.forgotpassword);

// router.route("/resetpassword").patch(verifyToken, authControllers.resetPassword);

// router.route("/changepassword").patch(verifyToken, authControllers.ChangePassword);

router.route("/addbooking").post(verifyToken, authControllers.AddBooking);

router.route("/bookinglist").get(verifyToken, authControllers.bookingList);

router.route("/deletebooking/").patch(verifyToken, authControllers.deleteBooking);

router.route("/userlist").get(verifyToken, authControllers.userList);

router.route("/deleteemployee").patch(verifyToken, authControllers.deleteEmployee);

router.route("/adddisableddates").post(verifyToken, authControllers.addDisabledDates);

router.route("/disableddates").get(verifyToken, authControllers.DisabledDates);

// router.route("/").get((req, res) => {
//     res.render('index', { text: 'Hey' })
// });

module.exports = router;