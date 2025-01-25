const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    itemID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    buyerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
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
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
