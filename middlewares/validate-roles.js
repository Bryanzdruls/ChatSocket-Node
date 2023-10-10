const { response } = require("express")

const isAdminRole = (req, res=response,next) =>{
    if (!req.user) {
        return res.status(500).json({
            msg: 'Unable to verify role without token',
        })
    }
    const {role, name} = req.user

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not administrator`,
        })
    }
    next();
}
const haveRoles = (...roles) =>{
    return (req, res= response, next)=>{
        if (!req.user) {
            return res.status(500).json({
                msg: 'Unable to verify role without token',
            })
        }
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Service require one of those roles ${roles}`,
            })
        }
        next();
    }
}
module.exports = {
    isAdminRole,
    haveRoles
}