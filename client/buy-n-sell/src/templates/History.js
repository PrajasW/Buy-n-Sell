import React,{useEffect, useState} from "react";
import { Box, Container, Typography, FormControl, InputLabel, Select, MenuItem, Tab, Tabs } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Function to generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
  };
// const pendingOrders = [
// { _id: 'ORD123', itemName: 'Laptop', status: 'Pending' },
// { _id: 'ORD124', itemName: 'Smartphone', status: 'Pending' },
// ];

// const boughtItems = [
// { itemName: 'Tablet', purchaseDate: '2024-01-10' },
// { itemName: 'Headphones', purchaseDate: '2024-01-12' },
// ];

// const soldItems = [
// { itemName: 'Monitor', saleDate: '2024-01-05' },
// { itemName: 'Keyboard', saleDate: '2024-01-07' },
// ];


const getInfo = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:3081/info", {
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        });

        if (response.data.error) {
            console.log("Error: ", response.data.message);
            return null;
        }
        const userData = response.data.data;
        return userData.email;
    } catch (error) {
        if (error.response) {
            console.log(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
            console.log("Error Message: ", error.response.data?.message || "Unknown error");
            // naviate to logout
            window.location.href = "/logout";
        } else if (error.request) {
            console.log("No response from server.");
        } else {
            console.log("Error: ", error.message);
        }
        return null; 
    }
};

const getHistory = async () => {
    
    const token = localStorage.getItem("token");    
    try {
        const response = await axios.get("http://localhost:3081/getOrders", {
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        });
        
        if (response.data.error) {
            console.log("Error: ", response.data.message);
            return null;
        }
        const orders = response.data
        // console.log(orders)
        
        return orders;
    } catch (error) {
        if (error.response) {
            console.log(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
            console.log("Error Message: ", error.response.data?.message || "Unknown error");
            // naviate to logout
            window.location.href = "/logout";
        } else if (error.request) {
            console.log("No response from server.");
        } else {
            console.log("Error: ", error.message);
        }
        return null; 
    }
};

const changeOTP = async (data) => {
    const token = localStorage.getItem("token");    
    // console.log(data)
    try {
        const response = await axios.put("http://localhost:3081/changeOTP", {
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
            data: data
        });
        
        if (response.data.error) {
            console.log("Error: ", response.data.message);
            return null;
        }
        const orders = response.data
        
        return orders;
    } catch (error) {
        if (error.response) {
            console.log(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
            console.log("Error Message: ", error.response.data?.message || "Unknown error");
            // naviate to logout
            // window.location.href = "/logout";
        } else if (error.request) {
            console.log("No response from server.");
        } else {
            console.log("Error: ", error.message);
        }
        return null; 
    }
}

function History() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [pendingOrders,setPendingOrders] = useState([]);
    const [boughtItems,setBoughtItems] = useState([]);
    const [soldItems,setSoldItems] = useState([]);
    
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const email = await getInfo();
            const orders = await getHistory();
            const pending = [];
            const bought = [];
            const sold = [];
            const data = [];
            if(!orders){
                return [];
            }
            for(let i = 0; i < orders.length ; i++){
                if(!orders[i].processed){
                    const otp = generateOTP();
                    data.push({
                        _id: orders[i]._id,
                        newotp: otp
                    });
                    orders[i].otp = otp;
                    pending.push(orders[i]);
                }
                else{
                    if(orders[i].buyerID === email){
                        bought.push(orders[i]);
                    }
                    else{
                        sold.push(orders[i]);
                    }
                }
            }
            if(data){
                changeOTP(data);
            }

            setPendingOrders(pending);
            setBoughtItems(bought);
            setSoldItems(sold);
            
        };

        fetchData();
    }, []);
    const handleClick = (id) => {
        navigate(`/item/${id}`);
    }
    return (
        <Box>
        <Navbar/>
        <Box
            sx={{
            backgroundColor: "background.default",
            minHeight: "100vh",
            py: 4, 
            }}
        >
            <Container maxWidth="lg" >
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: "text.primary" }}
            >
                Order History

            </Typography>
            </Container>
            <Container
            sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                mb: 4, 
            }}>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="user orders tabs">
                <Tab label="Pending Orders" />
                <Tab label="Bought Items" />
                <Tab label="Sold Items" />
            </Tabs>

            </Container>
            <Container>
            <Box sx={{ padding: 3 }}>
            {pendingOrders && selectedTab === 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {pendingOrders.map((order) => (
                <Box sx={{ minWidth: 500 , textAlign:"center" }} key={order._id} >
                    <Card>
                    <CardContent
                    onClick={() => {handleClick(order.itemID)}}
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: "ButtonShadow",
                      }}}>
                        <Typography variant="h4" >{order.itemName}</Typography>
                        <Typography variant="h6" color="textPrimary">Seller ID: {order.sellerID}</Typography>
                        <Typography variant="h6" color="textSecondary">Order ID: {order._id}</Typography>
                        <Typography variant="h6" sx={{outline:2, margin:3 , padding: 2 , textAlign:"center"}}>OTP: {order.otp}</Typography>
                    </CardContent>
                    </Card>
                </Box>
                ))}
            </Box>
            )}

            {boughtItems && selectedTab === 1 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {boughtItems.map((order) => (
                    <Box sx={{ minWidth: 500, textAlign:"center" }} key={order._id}>
                    <Card>
                    <CardContent 
                    onClick={() => {handleClick(order.itemID)}}
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: "ButtonShadow",
                      }}}>
                        <Typography variant="h4">{order.itemName}</Typography>
                        <Typography variant="h6" color="textSecondary">Order ID: {order._id}</Typography>
                        <Typography variant="h6" color="textPrimary">Purchased From: {order.sellerID}</Typography>
                    </CardContent>
                    </Card>
                </Box>
                ))}
            </Box>
            )}

            {soldItems && selectedTab === 2 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }} >
                {soldItems.map((order) => (
                <Box sx={{  minWidth: 500, textAlign:"center" }} key={order._id}>
                    <Card>
                    <CardContent 
                    onClick={() => {handleClick(order.itemID)}}
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: "ButtonShadow",
                      }}}>
                        <Typography variant="h4">{order.itemName}</Typography>
                        <Typography variant="h6" color="textSecondary">Order ID: {order._id}</Typography>
                        <Typography variant="h6" color="textPrimary">Sold To: {order.buyerID}</Typography>
                    </CardContent>
                    </Card>
                </Box>
                ))}
            </Box>
            )}
        </Box>
        </Container>
        </Box>
    </Box>
    );
}

export default History;
