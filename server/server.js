require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const infoRoute = require('./routes/info');
const verifyRoute = require('./routes/verify');
const updateProfileRoute = require('./routes/updateProfile');
const createItemRoute = require('./routes/createItem');
const getShopRoute = require('./routes/getShop');
const viewItemRoute = require('./routes/viewItem');
const viewCartRoute = require('./routes/viewCart');
const addToCartRoute = require('./routes/addToCart');
const removeCartRoute = require('./routes/removeCart');
const checkoutRoute = require('./routes/checkout');
const getOrdersRoute = require('./routes/getOrders');
const changeOTPRoute = require('./routes/changeOTP');
const getDeliveriesRoute = require('./routes/getDeliveries');
const closeTransactionRoute = require('./routes/closeTransaction');

app.use(express.json());
app.use(cors());
connectDB();
app.use("/login",authRoute);
app.use("/register",userRoute);
app.use("/info",infoRoute);
app.use("/verify",verifyRoute);
app.use("/updateProfile",updateProfileRoute);
app.use("/createItem",createItemRoute);
app.use("/getShop",getShopRoute);
app.use("/item",viewItemRoute);
app.use("/cart",viewCartRoute);
app.use("/addToCart",addToCartRoute);
app.use("/removeCart",removeCartRoute);
app.use("/checkout",checkoutRoute);
app.use("/getOrders",getOrdersRoute);
app.use("/getDeliveries",getDeliveriesRoute)
app.use("/changeOTP",changeOTPRoute);
app.use("/closeTransaction",closeTransactionRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
