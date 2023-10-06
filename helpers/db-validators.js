const Role = require('../models/role');
const User = require('../models/user');
const validRole = async(role = '') =>{
    const existRole  = await Role.findOne({role});
    if (!existRole){
        throw new Error('Role doesnt exist');
    }
}
const validEmail = async (email='') =>{
    const existEmail = await User.findOne({email});
    if (existEmail) {
      throw new Error('Email Already Exist.')
    }
}
const validId = async (id) =>{
    const existUser = await User.findById(id);
    if (!existUser) {
      throw new Error("Id doesn't Exist.")
    }
}
module.exports = {
    validRole,
    validEmail,
    validId
}
