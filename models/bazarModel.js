const bazarMongo = require("mongoose");



const bazarSchema = bazarMongo.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    messid: {
        required: true,
        type: String,
        trim: true,
    },
    date: {
        type: String,
        trim: true,
    },
    bazar: {
        type: [String],
    },
    quantity: {
        type: [String],
    },
    cost: {
        type: [Number],
    },
    

});

const bazarInfo = bazarMongo.model("BazarInfo", bazarSchema);

module.exports = bazarInfo;