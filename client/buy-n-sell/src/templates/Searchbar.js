import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";

const SearchBar = ({ placeholder = "Search...", onChange, value }) => {
  const theme = useTheme(); // Access your custom theme

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.primary.main }} />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: theme.palette.background.paper, // Use your theme's background color
          borderRadius: "4px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent", // Hide border
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.light, // Border on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main, // Highlight on focus
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
