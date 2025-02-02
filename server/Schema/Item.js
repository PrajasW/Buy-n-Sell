const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1.Name
// 2.Price
// 3. Description
// 4.Category (example: clothing, grocery, etc.)
// 5.Seller ID

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        // check positive
        check: (price) => price > 0,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        clothing: {
            type: Boolean,
            default: false,
        },
        grocery: {
            type: Boolean,
            default: false,
        },
        electronics: {
            type: Boolean,
            default: false,
        },
        beauty: {
            type: Boolean,
            default: false,
        },
        sports: {
            type: Boolean,
            default: false,
        },
        home: {
            type: Boolean,
            default: false,
        },
        books: {
            type: Boolean,
            default: false,
        },
        toys: {
            type: Boolean,
            default: false,
        },
    },    
    sellerID: {
        type: String,
        required: true,
    },
    sold: {
        type: Boolean,
        default: false
    }
});
const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
