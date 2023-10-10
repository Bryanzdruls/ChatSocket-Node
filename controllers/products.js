const { response } = require("express");
const {Product, Category} = require("../models/");


const getProducts = async(req,res=response) => {
    const {limit= 5, from = 0}  = req.query;
    const query = {state:true}
    try {
        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .populate('user', 'name')
                .populate('category','name')
        ])
        
        res.status(200).json({
          total,
          products
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}
const getProduct = async(req, res=response) => {
    const {id} = req.params;
    try {
        const product = await Product.findById(id).populate('user', 'name').populate('category','name');
        res.status(200).json({
            product
          });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}
const createProduct = async(req,res= response) =>{
    const name = req.body.name.toUpperCase();
    const {state, user, ...body} = req.body;
    const productDB  = await Product.findOne({name: body.name});

    try {       
        if (productDB) {
            return res.status(400).json({
                msg: `Product ${productDB.name} already exists.`,
            })
        }

        //Generar data a guardar
        const data = {
            ...body,
            name,
            user: req.user._id,

        }
        
        const product = await new Product(data);
        //Guardar DB
        await product.save();
        res.status(201).json({
            product,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        });
    }
}
const updateProduct = async(req, res=response) => {
    const {id} = req.params;
    const {state, user, ...data } = req.body
    
    if (data.name) {
        data.name =data.name.toUpperCase();
    }
    data.user = req.user._id;
    try {
        const [oldProduct,newProduct] = await Promise.all([
            Product.findByIdAndUpdate(id,data),
            Product.findById(id),
        ])
        
        res.status(201).json({
            oldProduct,
            newProduct
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}
const deleteProduct = async(req, res=response) => {
    const {id} = req.params;
    const change = {state:false};

    try {
        const productDeleted = await Product.findByIdAndUpdate(id,change);
        res.status(201).json({
            productDeleted
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Internal server Error`,
        })
    }
}
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}