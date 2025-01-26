const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    itemID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    buyerID: {
        type: String,
        required: true,
    },
    sellerID: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    hashedOTP: {
        type: String,
        required: true,
    },
    processed : {
        type: Boolean,
        required: true,
        default: false,
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
