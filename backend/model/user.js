    const mongoose = require('mongoose');

    const userschema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        tasks: [ {
            title: String,
            completed: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    });

    module.exports = mongoose.model('User',userschema);