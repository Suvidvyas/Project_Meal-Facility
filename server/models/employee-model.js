const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const EmployeeSchema = new mongoose.Schema({
    empId: {
        type: String,
        unique: true,
        required: true
    },
    firstName:{
        type:String,
        require: true
    },
    lastName:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require: true
    },
    phone:{
        type:String,
        require: true
    },
    department:{
        type:String,
        require: false
    },
    gender:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    },
    isAdmin:{
        type:String,
        default: false
    },
    isDelete:{
        type:String,
        default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

// json web token 
EmployeeSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                isAdmin: this.isAdmin,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn:"1h",
            }
        )
    } catch (error) {
        console.error(error);
    }
}

const Employee = new mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;