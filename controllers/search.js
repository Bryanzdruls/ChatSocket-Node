const { response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require("mongoose").Types;

const colectionAvailables = ["users", "categories", "products", "roles"];

const searchUsers = async(term = '', res = response) =>{
    const isMongoId = ObjectId.isValid( term );//true
    if (isMongoId) {
        const user = await User.findById(term); //caso id mongol
        return res.status(200).json({
            results: (user) ? [user]: []
        })
    }

    const regex = new RegExp(term, 'i');
    const users = await User.find({
        $or: [{name:regex}, {email:regex}],
        $and: [{state:true}]
    });

    res.status(200).json({
        results: (users) ? [users]: []
    })
}
const searchCategories = async(term = '', res = response) =>{
    const isMongoId = ObjectId.isValid( term );//true
    if (isMongoId) {
        const category = await Category.findById(term).populate('user','name'); //caso id mongol
        return res.status(200).json({
            results: (category) ? [category]: []
        })
    }
    const regex = new RegExp(term, 'i');
    const categories = await Category.find({
        $and: [{name:regex}, {state:true}],
    }).populate('user','name');

    res.status(200).json({
        results: (categories) ? [categories]: []
    })
}
const searchProducts = async(term = '', res = response) =>{
    const isMongoId = ObjectId.isValid( term );//true
    if (isMongoId) {
        const product = await Product.findById(term).populate('category','name'); //caso id mongol
        return res.status(200).json({
            results: (product) ? [product]: []
        })
    }
    const regex = new RegExp(term, 'i');
    const products = await Product.find({
        $and: [{name:regex}, {state:true}],
    }).populate('category','name');
    
    res.status(200).json({
        results: (products) ? [products]: []
    })
}
const search = async (req, res = response) => {
  const { colection, term } = req.params;
  if (!colectionAvailables.includes(colection)) {
    return res.status(400).json({
      msg: `Allowed Colections are: ${colectionAvailables}`,
    });
  }

  switch (colection) {
    case "users":
        searchUsers(term, res)
      break;
    case "categories":
        searchCategories(term,res);
      break;
    case "products":
        searchProducts(term,res);
      break;

    default:
        res.status(500).json({
            msg:'Internal server Error'
        })
      break;
  }
};
module.exports = {
  search,
};
