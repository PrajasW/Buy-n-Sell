import React,{useState} from "react";
import { Box, Container, Typography, FormControl, InputLabel, Select, MenuItem, Tab, Tabs } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import Navbar from "./Navbar";


// Function to generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
  };
const pendingOrders = [
{ orderId: 'ORD123', itemName: 'Laptop', status: 'Pending' },
{ orderId: 'ORD124', itemName: 'Smartphone', status: 'Pending' },
];

const boughtItems = [
{ itemName: 'Tablet', purchaseDate: '2024-01-10' },
{ itemName: 'Headphones', purchaseDate: '2024-01-12' },
];

const soldItems = [
{ itemName: 'Monitor', saleDate: '2024-01-05' },
{ itemName: 'Keyboard', saleDate: '2024-01-07' },
];

function History() {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

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
            {selectedTab === 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {pendingOrders.map((order) => (
                <Box sx={{ flex: '1 1 calc(33% - 16px)', minWidth: 250 , textAlign:"center" }} key={order.orderId}>
                    <Card>
                    <CardContent>
                        <Typography variant="h4" >{order.itemName}</Typography>
                        <Typography variant="h6" color="textSecondary">Order ID: {order.orderId}</Typography>
                        <Typography variant="h6" sx={{outline:2, margin:3 , padding: 2 , textAlign:"center"}}>OTP: {generateOTP()}</Typography>
                    </CardContent>
                    </Card>
                </Box>
                ))}
            </Box>
            )}

            {selectedTab === 1 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {boughtItems.map((item, index) => (
                <Box sx={{ flex: '1 1 calc(33% - 16px)', minWidth: 250, textAlign:"center" }} key={index}>
                    <Card>
                    <CardContent>
                        <Typography variant="h4">{item.itemName}</Typography>
                        <Typography variant="h6" color="textSecondary">Purchased on: {item.purchaseDate}</Typography>
                    </CardContent>
                    </Card>
                </Box>
                ))}
            </Box>
            )}

            {selectedTab === 2 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {soldItems.map((item, index) => (
                <Box sx={{ flex: '1 1 calc(33% - 16px)', minWidth: 250, textAlign:"center" }} key={index}>
                    <Card>
                    <CardContent>
                        <Typography variant="h4">{item.itemName}</Typography>
                        <Typography variant="h6" color="textSecondary">Sold on: {item.saleDate}</Typography>
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
