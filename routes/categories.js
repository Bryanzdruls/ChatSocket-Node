const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { existCategory } = require("../helpers/db-validators");
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/categories");

const router = Router();

//Url/api/categories
//Obtener categorias
router.get('/', getCategories);
//GEt una categoria (id)
router.get('/:id',[
    check('id').custom( existCategory ).isMongoId(),
    validateFields
], getCategory);

//crear categoria PRIVADO- cualquier persona token valido
router.post('/', 
[
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validateFields
],createCategory);

//Actualizar categoria PRIVADO- cualquier persona token valido
router.put('/:id',[
    validateJWT,
    check('id').custom( existCategory ).isMongoId(),
    validateFields
], updateCategory)
//Borrar una categoria Privado SOLO ADMIN
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id').custom( existCategory ).isMongoId(),
    validateFields
], deleteCategory)
module.exports = router;