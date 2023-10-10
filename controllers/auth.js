const response = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user.js');
const { generateJWT } = require('../helpers/generate-jwt.js');
const { googleVerify } = require('../helpers/google-verify.js');
const login = async(req,res=response) =>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        //Se valida que el usuario Exista
        if (!user) {
            return res.status(400).json({
                msg: 'User / password is not valid '
            })
        }
        //Se valida que el usuario se encuentre activo
        if (!user.state) {
            return res.status(400).json({
                msg: 'User / password is not valid '
            })
        }

        //Se valida que la contraseña este correcta
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'User / password is not valid '
            })
        }

        //Se genera el JWT
        const token  = await generateJWT(user.id);
        res.json({
            msg: 'Login Ok',
            user,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Internal Error'
        })
    }
    
}

const googleSignIn = async (req , res = response) =>{
    const {id_token } = req.body;
    try {
        const {name,email,img} = await googleVerify(id_token);
        
        let user = await User.findOne({email});

        if (!user) {
            //Se crea
            const data = {
                name,
                email,
                password: ':pp',
                img,
                google: true,
                
            };
            user = new User(data)
            await user.save();
        }
        //Si el user db
        if (!user.state) {
            return res.status(401).json({
                msg:'Blocked user'
            });
        }
        
        //Generar JWT
        const token  = await generateJWT(user.id);

        res.json({
            msg: 'Ok',
            token,
            user
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:'Unable to verify token'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}