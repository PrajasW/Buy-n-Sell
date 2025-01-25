import React, { useState } from "react";
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

function Delivery() {
    const [orders, setOrders] = useState([
        {
            id: 1,
            itemName: "Laptop",
            price: 800,
            buyer: "Alice",
            otp: "1234", // In a real-world app, this should not be exposed
        },
        {
            id: 2,
            itemName: "Phone",
            price: 500,
            buyer: "Bob",
            otp: "5678",
        },
    ]);

    const [otpInput, setOtpInput] = useState({});
    const [error, setError] = useState("");

    const handleOtpChange = (orderId, value) => {
        setOtpInput((prev) => ({
            ...prev,
            [orderId]: value,
        }));
    };

    const handleTransactionClose = (orderId) => {
        const order = orders.find((o) => o.id === orderId);
        if (order && otpInput[orderId] === order.otp) {
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
            setError("");
            alert("Transaction closed successfully!");
        } else {
            setError("Incorrect OTP. Please try again.");
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
                    {orders.map((order) => (
                        <Paper
                        key={order.id}
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
                            <Typography variant="h5">
                                {order.buyer}
                            </Typography>

                            <Typography variant="h5">
                                ${order.price}
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
                                    size="small"
                                    value={otpInput[order.id] || ""}
                                    onChange={(e) =>
                                        handleOtpChange(order.id, e.target.value)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleTransactionClose(order.id)}
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
