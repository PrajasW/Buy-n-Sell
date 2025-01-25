import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography, Button } from "@mui/material";

function removeToken() {
    localStorage.removeItem("token");
}
function Logout() {
    removeToken();
    return (
        <Box
        sx={{
          backgroundColor: "background.default",
          color: "text.primary",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Logout Successful
        </Typography>
        <Typography variant="body1" gutterBottom>
          You have successfully logged out. Thank you for visiting!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/login"
          sx={{ mt: 2 }}
        >
          Log in Again
        </Button>
      </Box>
    )
}

export default Logout;
