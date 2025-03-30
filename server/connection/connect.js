const mongose = require('mongoose');

const connection = async () => {
    try {
        await mongose.connect('mongodb://localhost:27017');
        console.log('Nos pudimos conectar a la bd');
    } catch (error) {
        console.log(error.message);
    };
};

connection();