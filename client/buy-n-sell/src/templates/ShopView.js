import React,{useState} from "react";
import { CardContent, Chip, Container, ListItem } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, Card } from "@mui/material";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom"; // Optional: Replace with your router if needed

import SearchBar from "./Searchbar";
import ShopItem from "./ShopItem";


const itemsList = [
  "Wireless Headphones",
  "Smartphone",
  "Bluetooth Speaker",
  "Laptop Stand",
  "Running Shoes",
  "Coffee Maker",
  "Desk Organizer",
  "Travel Backpack",
  "Noise-Canceling Earbuds",
  "Water Bottle",
];
const vendors = [
  "TechMart",
  "GadgetHub",
  "Outdoor Essentials",
  "Lifestyle Depot",
  "Urban Outfitters",
  "HomePro",
  "Sports Corner",
  "Trendy Travel",
  "Music & Sound",
  "Everyday Goods",
];
const categoriesList = [
  "Electronics",
  "Accessories",
  "Sports",
  "Home Appliances",
  "Travel",
  "Lifestyle",
  "Fitness",
];
const generateNamedItems = () => {
  
    return itemsList.map((item, index) => ({
      itemName: item,
      price: `$${(Math.random() * 100 + 1).toFixed(2)}`, // Random price
      vendor: `${vendors[index % vendors.length]} [${(Math.random() * 5).toFixed(1)}⭐]`,
      categories: categoriesList.slice(0, Math.floor(Math.random() * 3) + 1), // Random categories
    }));
};

  

function Shop() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [items] = useState(generateNamedItems());

    const handleCategoryChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    const filteredItems = selectedCategories.length
    ? items.filter((item) =>
        item.categories.some((category) => selectedCategories.includes(category))
      )
    : items;

    return (
    <Box>
        <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* User Profile Link */}
          <Typography variant="h6" sx={{ fontFamily: "Oswald, sans-serif" }}>
            <Button
              sx={{
                textTransform: "none",
                color: "inherit",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            >
              Guest
            </Button>
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
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
                Shop For Products
            </Typography>

            {/* <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 4, 
                }}
            >
                <SearchBar placeholder="Search for products..." /> */}
            {/* </Box> */}

            <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start", // Aligns items to the left
                alignItems: "center", // Vertically centers the items
                mb: 4,
                gap: 2, // Adds space between the search bar and dropdown
            }}
            >
            {/* Search Bar */}
            <SearchBar placeholder="Search for products..." />

            {/* Filter Dropdown */}
            <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>Select Categories</InputLabel>
                <Select
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                renderValue={(selected) => selected.join(", ")}
                >
                {categoriesList.map((category, index) => (
                    <MenuItem key={index} value={category}>
                    {category}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Box>
            
            {/* Item List Section */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {filteredItems.map((item, index) => (
          <Box key={index} sx={{ width: { xs: "100%", sm: "48%", md: "30%" }, mb: 4 }}>
            <ShopItem {...item} />
          </Box>
        ))}
      </Box>

            
            </Container>
        </Box>
    </Box>
    );
}

export default Shop;
