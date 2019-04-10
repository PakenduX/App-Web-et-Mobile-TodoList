let mongoose = require('mongoose');

let Todos = mongoose.model('Todos', {
    text: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    group: mongoose.Schema.Types.ObjectId,
    date: Date,
    done: Boolean
});

module.exports = Todos;