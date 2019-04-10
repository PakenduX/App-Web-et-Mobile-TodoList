let mongoose = require('mongoose');

let TodoGroup = mongoose.model('TodoGroup', {
    nom: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: Date,
});

module.exports = TodoGroup;