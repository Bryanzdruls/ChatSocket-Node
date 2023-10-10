const { Router } = require("express");
const { check } = require("express-validator");
const { usersGet, usersPost, usersPut, usersPatch, usersDelete } = require("../controllers/user");


const {validateFields,validateJWT,isAdminRole,haveRoles} = require('../middlewares')

const { validRole,  validEmail, validId } = require("../helpers/db-validators");
const router = Router();


router.get("/", usersGet);

router.put('/:id',[
    check('id', 'Is not a valid id').isMongoId().bail().custom( validId),
    check('role').custom( validRole ),
    validateFields,
], usersPut);



router.post("/",[
    check('name','Name is a must').not().isEmpty(),
    check('password','password is a must min 6 characteres').isLength({ min:6 }),
    check('email','Email is not valid').isEmail(),
    check('email').custom( validEmail),
    check('role').custom( validRole ),
    validateFields,
], usersPost );
router.patch("/", usersPatch);

router.delete('/:id',[
    validateJWT,
    isAdminRole,
    //haveRoles('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'Is not a valid id').isMongoId().bail().custom( validId ),
    validateFields,
], usersDelete);

module.exports = router;
