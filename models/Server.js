const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.js');
const fileUpload = require('express-fileupload');


class Server {

    constructor(){
        this.app = express(); 
        this.port = process.env.PORT;
        this.paths = {
            users: '/api/users',
            search: '/api/search',
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            uploads: '/api/uploads'
        }
        
        //Coneccion DB
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de la app
        this.routes();
    }
    async conectarDB() {
        await dbConnection();
    }
    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo
        this.app.use(express.json());
        //Directorio publico 
        this.app.use(express.static('public'));

        //// carga archivos 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.js'));
        this.app.use(this.paths.users, require('../routes/user.js'));
        this.app.use(this.paths.search, require('../routes/search.js'));
        this.app.use(this.paths.categories, require('../routes/categories.js'));
        this.app.use(this.paths.products, require('../routes/products.js'));
        this.app.use(this.paths.uploads, require('../routes/uploads.js'));
    }

    listen(){
        this.app.listen( this.port, ()=> {
            console.log('Servidor corriendo en: ',this.port);
        })
    }
}

module.exports = Server;