import React,{useState} from "react";
import { Box, CardContent, Chip, Container, ListItem, Typography } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, Card } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import SearchBar from "./Searchbar";
import ShopItem from "./ShopItem";

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

const categoriesList = [
  "clothing",
  "grocery",
  "electronics",
  "beauty",
  "sports",
  "home",
  "books",
  "toys"
];

const getShop = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3081/getShop",{headers: { "Content-Type": "application/json", "authorization" : token }});
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
function Shop() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [items, setItems] = useState([]);

    const handleCategoryChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value.toLowerCase());
    };

    useEffect(() => {

        // to check for loged in user
        getInfo();
        const fetchShopItems = async () => {
        const shopItems = await getShop();
        if(!shopItems) return;
        shopItems.forEach((item) => {
          const categoryData = item.category;
          // console.log(item)
          const CategoriesText = Object.keys(categoryData).filter(key => categoryData[key]);
          item.categories = CategoriesText;
          // console.log(CategoriesText)
        });
        setItems(shopItems); // Add the fetched items to the state
      };
      
      fetchShopItems();
      
      }, []);

    const filteredItems = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery);

      const matchesCategory =
        !selectedCategories.length ||
        item.categories.some((category) =>
          selectedCategories.includes(category)
        );
  
      return matchesSearch && matchesCategory;
    });
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
            <Container maxWidth="lg" >
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: "text.primary" }}
            >
                Shop For Products
            </Typography>
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
            <SearchBar value={searchQuery} onChange={handleSearchChange} placeholder="Search for products..." />

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
            
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {filteredItems && filteredItems.map((item, index) => (
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
