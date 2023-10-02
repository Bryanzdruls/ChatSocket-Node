const {request,response} = require('express')

const usersGet =(req, res= response) => {
    res.status(200).json({
      ok: "true",
      msg: "get Api - Controllador",
    });
}
const usersPost =(req, res) => {
    const {nombre} =req.body;
    res.status(200).json({
      ok: "true",
      msg: "post Api - Controllador",
      nombre,
    });
}
const usersPut =(req= request, res) => {
    const id  = req.params.id;
    res.status(200).json({
      ok: "true",
      msg: "put Api - Controllador ",
      id
    });
}
const usersPatch = (req, res) => {
    res.status(200).json({
      ok: "true",
      msg: "patch Api - Controllador ",
    });
}
const usersDelete =(req, res) => {
    res.status(200).json({
      ok: "true",
      msg: "delete Api - Controllador",
    });
  }
module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
}