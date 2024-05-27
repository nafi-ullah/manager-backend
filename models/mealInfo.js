const mealMongo = require("mongoose");

//create schema
// create model of that schema
//export, so that save in database.

const mealInfoSchema = mealMongo.Schema({
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
    lunchMeal: {
        type: String,
        trim: true,

    },
    lunchCount: {
        type: Number,
        trim: true,
    },
    dinnerMeal: {
        type: String,
        trim: true,
        default: ''
    },
    dinnerCount: {
        type: Number,
        trim: true,
        default: 0
    },
    lunchComment: {
        type: String,
    },
    dinnerComment: {
        type: String,
        default: ''
    }

});

const mealInfo = mealMongo.model("MealInformation", mealInfoSchema);

module.exports = mealInfo;