import React from 'react';
import {Card, Box, CardContent, Chip, Container, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';


function ShopItem(item){
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/item/${item._id}`);
    }
  return (
        <Card
              onClick={handleClick}
              sx={{
                ":hover": {
                  cursor: "pointer",
                  backgroundColor: "ButtonShadow",
                },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px",
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                padding: 2,
              }}
            >
              <CardContent>
                <Typography variant="h4" component="div" >
                  {item.name}
                </Typography>
                <Typography variant="h5">
                  Price: ₹{item.price}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Vendor: {item.sellerID}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {item.categories.map((category, idx) => (
                    <Chip key={idx} label={category} variant="outlined" sx={{ borderRadius: "4px" }} />
                  ))}
                </Box>
              </CardContent>
        </Card>
    );
};

export default ShopItem;