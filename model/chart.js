var mongoose = require('mongoose');
var connection = require('../config/db');
var Schema = mongoose.Schema;

var chartSchema = new Schema({
    year           : String,
    month          : String,
    week           : String,
    goal           : {
        off : Number,
        ap  : Number,
        b2b : Number,
        b2c : Number,
        ct  : Number,
        bd  : Number,
        sc  : Number,
        total : Number
    },
    sales           : {
        off : { type: Number, default: 0 },
        ap  : { type: Number, default: 0 },
        b2b : { type: Number, default: 0 },
        b2c : { type: Number, default: 0 },
        ct  : { type: Number, default: 0 },
        bd  : { type: Number, default: 0 },
        sc  : { type: Number, default: 0 },
        total  : { type: Number, default: 0 }
    },
    Achievement     : [{
        week    : String,
        off     : Number,
        ap      : Number,
        b2b     : Number,
        b2c     : Number,
        ct      : Number,
        bd      : Number,
        sc      : Number
    }],
    regDate        : Date
});

module.exports = connection.model('chartModel',chartSchema);;