const {request,response} = require('express')
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const usersGet =async(req = request, res= response) => {
    const {limit= 5, from = 0} = req.query;
    const query = {state:true}

    const [total, user] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(from))
        .limit(Number(limit)),
    ])
    res.status(200).json({
      total,
      user
    });
}
const usersPost = async (req, res) => {
    const {name, email, password, role, ...rest} =req.body;
    const user = new User( {name, email, password, role,} );

    //Encriptar Contraseña
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync( password, salt );
    //Guardar en BD
    await user.save();
    res.status(200).json({
      ok: "true",
      msg: "post Api - Controllador",
      user,
    });
}
const usersPut = async(req= request, res) => {
    const {id } = req.params;
    const {_id , password, google, email, ...rest} = req.body;

    //TODO VALIDAR CON BD
    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      rest.password = bcryptjs.hashSync( password, salt );
    }

    const userDb  = await User.findByIdAndUpdate(id, rest);

    res.status(200).json({
      ok: "true",
      msg: "put Api - Controllador ",
      userDb
    });
}
const usersPatch = (req, res) => {
    res.status(200).json({
      ok: "true",
      msg: "patch Api - Controllador ",
    });
}
const usersDelete = async(req, res) => {
    const {id} = req.params;
    
    const user  = await User.findByIdAndUpdate(id, {state:false});
    res.status(200).json({
      id
    });
  }



module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
}