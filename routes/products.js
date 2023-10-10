const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/products");
const { existProduct, existCategory } = require("../helpers/db-validators");

const router = Router();

//Url/api/categories
//Obtener categorias
router.get('/', getProducts);
//GEt una categoria (id)
router.get('/:id',[
    check('id').custom( existProduct ).isMongoId(),
    validateFields
], getProduct);
//crear categoria PRIVADO- cualquier persona token valido
router.post('/', 
[
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('category', 'Category id is not a valid mongo id').isMongoId(),
    check('category').custom( existCategory),
    validateFields
], createProduct);


//Actualizar categoria PRIVADO- cualquier persona token valido
router.put('/:id',[
    validateJWT,
    check('id').custom( existProduct ).isMongoId(),
    validateFields
], updateProduct)
//Borrar una categoria Privado SOLO ADMIN
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id').custom( existProduct ).isMongoId(),
    validateFields
], deleteProduct)
module.exports = router;