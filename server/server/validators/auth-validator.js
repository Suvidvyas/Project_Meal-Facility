const { z } = require("zod");

// Creating an object schema
const registerSchema = z.object({
    username: z
        .string({ required_error: "Name is Required" })
        .trim()
        .min(3, { message: "Name must be atleast 3 characters long" })
        .max(20, { message: "Name must not exceed 20 characters" }),
    email: z
        .string({ required_error: "Email is Required" })
        .trim()
        .email({ message: "Invalid email format" })
        .max(50, { message: "Email must not exceed 50 characters" })
        .min(3, { message: "Email must be atleast 6 characters long" }),
    phone: z
        .string({ required_error: "Phone is Required" })
        .trim()
        .min(10, { message: "Phone must be atleast 10 digits long" })
        .max(10, { message: "Phonenumber is not more than 10 digits long" })
        .regex(/^\d{10}$/, "Invalid phone number"),
    password: z
        .string({ required_error: "Password is Required" })
        .trim()
        .min(6, { message: "Password must be atleast 6 characters long" })
        .max(50, { message: "Password must not exceed 50 characters" })
});
module.exports = {
    registerSchema
}
