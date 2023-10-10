const { Category, Role, User, Product } = require('../models');

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
      throw new Error("It doesn't Exist.")
    }
}
const existCategory = async (id) =>{
    const existCategory = await Category.findById(id);
    if (!existCategory) {
      throw new Error("It doesn't Exist.")
    }
}
const existProduct= async (id) =>{
  const existProduct = await Product.findById(id);
  if (!existProduct) {
    throw new Error("It doesn't Exist.")
  }
}
module.exports = {
    validRole,
    validEmail,
    validId,
    existCategory,
    existProduct
}
