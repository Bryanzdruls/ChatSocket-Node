const { response, request } = require("express");
const { uploadFile } = require("../helpers");
const { User,Product} =require('../models')
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL);

const loadFile = async (req, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      res.status(400).json({
        msg: "No files were uploaded.",
      });
      return;
    }
    try {    
        const name =await uploadFile(req.files);
        res.json({
            name    
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'bad request'    
        })
    }
};

const updateFile = async(req, res =response) =>{
    const {id, collection} = req.params;
    res.json({
        id,
        collection
    })
}

const updateImage = async(req=request, res) =>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({
          msg: "No files were uploaded.",
        });
        return;
    }
    const {id,collection} = req.params;

    let model;
    switch (collection) {
        case 'users':
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: 'User with this id doesnt exist'
                    })
                }
            break;
        case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: 'Product with this id doesnt exist'
                    })
                }
            break;
        default:
            return res.status(500).json({
                msg:'Not handled exception'
            })

    }
    //limpiar img
    try {
        if (model.img) {
            //hay q borrar la imagen
            const pathImg  = path.join(__dirname, '../uploads', collection, model.img);
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }
    } catch (error) {
        
    }
    model.img = await uploadFile(req.files,undefined,collection);
    await model.save();

    res.json({
        model
    })
}
const updateImageCloudinary = async(req=request, res) =>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({
          msg: "No files were uploaded.",
        });
        return;
    }
    const {id,collection} = req.params;

    let model;
    switch (collection) {
        case 'users':
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: 'User with this id doesnt exist'
                    })
                }
            break;
        case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: 'Product with this id doesnt exist'
                    })
                }
            break;
        default:
            return res.status(500).json({
                msg:'Not handled exception'
            })

    }
    //limpiar img
    try {
        if (model.img) {
            //hay q borrar la imagen
            const nameArr  =model.img.split('/');
            const nameImg = nameArr[nameArr.length -1];
            const [public_id] = nameImg.split('.');
            console.log(public_id);
            cloudinary.uploader.destroy( public_id);
        }
    } catch (error) {
        console.log(error);
    }
    const {tempFilePath} =req.files.file
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath );
    
    model.img = secure_url;
    await model.save();

    res.json({
        model 
    })
}

const showImages = async(req,res=response) =>{
    const {id,collection} = req.params;

    let model;
    switch (collection) {
        case 'users':
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: 'User with this id doesnt exist'
                    })
                }
            break;
        case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: 'Product with this id doesnt exist'
                    })
                }
            break;
        default:
            return res.status(500).json({
                msg:'Not handled exception'
            })
    }
    //limpiar img
    try {
        if (model.img) {
            //hay q borrar la imagen
            const pathImg  = path.join(__dirname, '../uploads', collection, model.img);
            if (fs.existsSync(pathImg)) {
                return res.sendFile(pathImg);
            }
        }
    } catch (error) {
        console.log(error);   
        res.status(500).json({
            msg: 'error'
        })     
    }
    const pathImg  = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImg);
    
}
module.exports = {
  loadFile,
  updateFile,
  updateImage,
  updateImageCloudinary,
  showImages,
};
