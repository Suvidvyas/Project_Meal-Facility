const Employee = require('../models/employee-model');

const getNextEmpId = async () => {
    const lastEmployee = await Employee.findOne().sort({ empId: -1 });
    if (!lastEmployee) {
        return 'E001';
    }
    const lastEmpId = lastEmployee.empId;
    const empIdNumber = parseInt(lastEmpId.substring(1)) + 1;
    const newEmpId = `E${empIdNumber.toString().padStart(3, '0')}`;
    return newEmpId;
};

module.exports = getNextEmpId;