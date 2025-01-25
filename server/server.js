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
app.use(express.json());
app.use(cors());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
