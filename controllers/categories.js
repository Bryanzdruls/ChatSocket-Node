const { response } = require("express");
const {Category} = require("../models/");

const getCategories = async(req ,res = response) => {
    const {limit= 5, from = 0}  = req.query;
    const query = {state:true}
    try {
        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .populate('user', 'name')
        ])
        
        res.status(200).json({
          total,
          categories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}

const getCategory = async(req, res=response) =>{
    const {id} = req.params;
    try {
        const category = await Category.findById(id).populate('user', 'name');
        res.status(200).json({
            category
          });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}
const createCategory = async(req,res= response) =>{
    const name = req.body.name.toUpperCase();
    const categoryDB  = await Category.findOne({name});

    try {       
        
        if (categoryDB) {
            return res.status(400).json({
                msg: `Category ${categoryDB.name} already exists.`,
            })
        }
        //Generar data a guardar
        const data = {
            name,
            user: req.user._id
        }
        const category = await new Category(data);

        //Guardar DB
        await category.save();
        res.status(201).json({
            category,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}
const updateCategory = async(req, res = response) =>{
    const {id} = req.params;
    const changes = req.body
    try {
        const [oldCategory,newCategory] = await Promise.all([
            Category.findByIdAndUpdate(id,changes),
            Category.findById(id),
        ])
        
        res.status(201).json({
            oldCategory,
            newCategory
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}

const deleteCategory = async(req,res=response) =>{
    const {id} = req.params;
    const change = {state:false};

    try {
        const categoryDeleted = await Category.findByIdAndUpdate(id,change);
        res.status(201).json({
            categoryDeleted
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }

}
module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}