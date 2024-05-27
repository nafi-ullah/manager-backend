const mymongo = require("mongoose");

//create schema
// create model of that schema
//export, so that save in database.

const memberSchema = mymongo.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                const re= /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: 'Please enter a valid email address',
        }
    },
    password: {
        required: true,
        type: String,
        validator: (value) => {
            
            return value.lenght < 5;
        },
        message: 'Please enter a more than 5 letter',
        
    },
    messid: {
        required: true,
        type: String,
        trim: true,
    },
    messname: {
        type: String,
        trim: true,
        default: ''
    },

});

const member = mymongo.model("Member", memberSchema);

module.exports = member;