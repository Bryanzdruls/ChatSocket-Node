const  mongoose = require('mongoose');

const dbConnection = async() =>{
    try {
        await mongoose.connect( process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('DB ONLINE');
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    dbConnection
}