import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
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
        userData.dateOfBirth = new Date(userData.dateOfBirth);
        return userData;
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

const getCart = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3081/cart", {
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

function Cart() {
    const [items, setItems] = useState([
    ]);

    useEffect(() => {
        getInfo();
        getCart().then((data) => {
            setItems(data);
            // console.log(data);
        });
    }, []);

    const totalCost = items.reduce((total, item) => total + item.price, 0);

    const handelRemoveItem = async (orderId) => {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3081/removeCart/${orderId}`,{
                headers: {
                    "Content-Type": "application/json",
                    authorization : token,
            }},
        ).then((res) => {
                if (res.data.error) {
                    console.log("Error: ", res.data.message);
                } else {
                    // console.log("Success: ", res.data.message);
                    setItems(items.filter((item) => item._id !== orderId));
                }
            })
            .catch((err) => {
                console.log("Error: ", err.response.data.message);
            });
    };
    const handelCheckout = async () => {
        const token = localStorage.getItem("token");
        await axios.put("http://localhost:3081/checkout",{},{
            headers: {
                "Content-Type": "application/json",
                authorization : token,
            },
        }).then((res) => {
            if (res.data.error) {
                console.log("Error: ", res.data.message);
            } else {
                console.log("Success: ", res.data.message);
                setItems([]);
            }
        })
        .catch((err) => {
            console.log("Error: ", err.response.data.message);
        });
    }

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

            <Container>
                <Typography
                    variant="h4"
                    sx={{ color: "text.primary" , mb: 4}}
                    gutterBottom
                >
                    Cart
                </Typography>
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}>
                {items.length !== 0 && items.map((item) => (
                    <Paper
                    key={item._id}
                    sx={{
                            padding: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                        >
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}> 
                        <Typography variant="h5">
                            {item.name}
                        </Typography>
                        <Typography name="h5">
                            {item.sellerID}
                        </Typography>

                        <Typography variant="h5">
                        ₹{item.price}
                        </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handelRemoveItem(item._id)}
                            >
                                Remove
                            </Button>
                        </Box>
                    </Paper>

                ))}
                {items.length !== 0 && (<Paper
                    sx={{
                            padding: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                        >
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}> 
                            <Typography variant="h5">
                                Total Cost : ₹{totalCost}
                            </Typography>
                            <Button variant="contained" color="secondary" size="large" onClick={handelCheckout}> 
                                Checkout
                            </Button>
                        </Box>
                    </Paper>)}
                {items.length === 0 && (
                    <Typography variant="h5">
                        Your cart is empty.
                    </Typography>
                )}
                
            </Box>
            </Container>

            </Box>
        </Box>
    )
}

export default Cart;
