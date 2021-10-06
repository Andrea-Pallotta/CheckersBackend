const mongoose = require('mongoose');

const mongodbConnect = async (uri) => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    } catch(err) {
        console.error(err);
    }
};

exports.mongodbConnect = mongodbConnect;