import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom"; // Optional: Replace with your router if needed
const Navbar = () => {
  // get the user name from the local Storage jwt token
  const userName = "Profile"
  return (
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* User Profile Link */}
          <Typography variant="h6" sx={{ fontFamily: "Oswald, sans-serif" }}>
            <Button
              component={Link}
              to="/profile"
              sx={{
                textTransform: "none",
                color: "inherit",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            >
              {userName}
            </Button>
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/shop"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              Shop
            </Button>
            <Button
              component={Link}
              to="/history"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              Order History
            </Button>
            <Button
              component={Link}
              to="/delivery"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              Delivery
            </Button>
            <Button
              component={Link}
              to="/cart"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              My Cart
            </Button>
            <Button
              component={Link}
              to="/sell"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              Sell
            </Button>
            <Button
              component={Link}
              to="/support"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              Support
            </Button>
            <Button
              component={Link}
              to="/logout"
              sx={{ textTransform: "none", color: "inherit" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;
