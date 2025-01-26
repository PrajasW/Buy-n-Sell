import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert
} from "@mui/material";
import Navbar from "./Navbar";
import axios from "axios";
import { data } from "react-router-dom";


const getHistory = async () => {
    const token = localStorage.getItem("token");    
    try {
        const response = await axios.get("http://localhost:3081/getDeliveries", {
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
};


function Delivery() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    
    useEffect(() => {
    const fetchData = async () => {
        const orders = await getHistory();
        if(orders){
            const updatedOrders = orders.map((order) => ({
                ...order,
                otp: "",
            }));
            setOrders(updatedOrders);            
        }
    };

        fetchData();
    }, []);

    const handleOtpChange = (orderId, value) => {
        setOrders   ((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId ? { ...order, otp: value } : order
            )
        );
    };

    const handleTransactionClose = async (orderId) => {
        // print the otp value
        const order = orders.find((o) => o._id === orderId);
        const data = {};
        if(order.otp && /^\d{6}$/.test(order.otp)) {
            data._id = order._id;
            data.otp = order.otp;
        } 
        else {
            setError("OTP must be a 6-digit number.");
            return;
        }
        // console.log(data);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put("http://localhost:3081/closeTransaction", {
                headers: {
                    "Content-Type": "application/json",
                    authorization: token,
                },
                data : data
            });
            console.log(response.data.message);
            if(response.data.message == "order succesfully closed"){
                // remove this item from page
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <Box>
            <Navbar />
        <Box
            sx={{
                backgroundColor: "background.default",
                minHeight: "100vh",
                py: 4,
            }}
            >
            <Container maxWidth="lg">
                <Typography variant="h4" gutterBottom>
                    Pending Orders
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                    >
                        {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mt: 3,
                                fontWeight: "bold",
                                textAlign: "center",
                                borderRadius: 2,
                                
                            }}
                            onClose={() => setError("")} // Close button for dismissing error
                        >
                            {error}
                        </Alert>
                    )}
                    {orders && orders.map((order) => (
                        <Paper
                        key={order._id}
                        sx={{
                                padding: 3,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                            >
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}> 
                            <Typography variant="h5">
                                {order.itemName}
                            </Typography>
                            <Typography variant="h6" color="secondary">
                                {order._id}
                            </Typography>
                            <Typography variant="h5">
                                {order.buyerID}
                            </Typography>
                            <Typography variant="h5">
                                ₹{order.amount}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    label="Enter OTP"
                                    variant="outlined"
                                    inputMode="numeric"
                                    size="small"
                                    value={order.otp}
                                    onChange={(e) =>
                                        handleOtpChange(order._id, e.target.value)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleTransactionClose(order._id)}
                                >
                                    Close Transaction
                                </Button>
                            </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>

            </Container>
            </Box>
        </Box>
    )
}

export default Delivery;
