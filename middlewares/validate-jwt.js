const jwt = require('jsonwebtoken');
const { response, request } = require('express');
const User = require('../models/user');

const validateJWT = async(req=request, res = response, next) =>{
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'There is not token in the request'
        })
    }
    try {
        
        const {uid} =jwt.verify( token, process.env.SECRET_KEY );
        const user = await User.findById(uid);
        
        //verificar user
        if (!user) {
            return res.status(401).json({
                msg: 'User doesnt exist'
            })
        }
        //Verificar si el uid no esta eliminado
        if (!user.state) {
            return res.status(401).json({
                msg: 'Not valid Token '
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Not valid Token '
        })
    }
}
const verifyJWT = async(token) => {
    try {
        if (token.length <10) {
            return null;
        }

        const {uid} = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(uid);
        if (user) {
            if (user.state) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
module.exports={
    validateJWT,
    verifyJWT
}