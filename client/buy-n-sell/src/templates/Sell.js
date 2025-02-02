import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import axios from "axios";

const SellProductForm = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    description: "",
    categories: {
        "clothing": false,
		"grocery": false,
		"electronics": false,
		"beauty": false,
		"sports": false,
		"home": false,
		"books": false,
		"toys": false
    },
  });

  const [apiResponse, setApiResponse] = useState("");

  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      categories: { ...prev.categories, [name]: checked },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isCategorySelected = Object.values(formData.categories).some(
      (selected) => selected
    );

    if (!formData.itemName || !formData.price || !formData.description) {
      setFormError("Please fill out all fields.");
      return;
    }
    if (isNaN(formData.price)) {
        setFormError("Price must be a number.");
        return;
    }
    if(parseFloat(formData.price) <= 0){
        setFormError("Price must be greater than 0.");
        return;
    }

    if (!isCategorySelected) {
      setFormError("Please select at least one category.");
      return;
    }

    setFormError("");
    console.log("Form submitted:", formData);

    const token = localStorage.getItem("token");
    if (!token) {
      setFormError("Please log in to sell a product.");
      return;
    }
    const submit = async () => {
        try{
            const data = {
                name: formData.itemName,
                price: formData.price,
                description: formData.description,
                category: formData.categories,
            };
            await axios.post("http://localhost:3081/createItem", data, {
                headers: {
                    Authorization: token,
                },
            });
            setFormError("");
            setApiResponse("Product successfully added to the listing.");
            setFormData({
                itemName: "",
                price: "",
                description: "",
                categories: {
                    "clothing": false,
                    "grocery": false,
                    "electronics": false,
                    "beauty": false,
                    "sports": false,
                    "home": false,
                    "books": false,
                    "toys": false,
                },
            });
        }
        catch(error){
            setFormError(error.response.data.message);
            console.error(error);
        }
    };
    submit();

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
        <Box
          sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
            >
          <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "90%",
                maxWidth: 700,
                padding: 4,
                bgcolor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
            }}
            >
                {
                    apiResponse && (
                        <Alert
                            severity="success"
                            sx={{
                                mt: 1,
                                mb: 2,
                                fontWeight: "bold",
                                textAlign: "center",
                                borderRadius: 2,
                                width: "90%",
                            }}
                            onClose={() => setApiResponse("")} // Close button for dismissing success message
                        >
                            {apiResponse}
                        </Alert>
                    )
                }
                {formError && (
                    <Alert
                        severity="error"
                        sx={{
                            mt: 1,
                            mb: 2,
                            fontWeight: "bold",
                            textAlign: "center",
                            borderRadius: 2,
                            width: "90%",
                        }}
                        onClose={() => setFormError("")} // Close button for dismissing error
                    >
                        {formError}
                    </Alert>
                )}
            <Typography variant="h4" gutterBottom color="text.primary">
              Sell Your Product
            </Typography>
            <Box
              component="form"
              sx={{ width: "100%" }}
              onSubmit={handleSubmit}
              >
              <Box
                sx={{
                    display: "flex",
                    gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  label="Item Name"
                  variant="outlined"
                  sx={{ flex: 1 }}
                  margin="normal"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  InputProps={{ style: { color: "text.primary" } }}
                  InputLabelProps={{ style: { color: "text.primary" } }}
                />
                <TextField
                  label="Price"
                  variant="outlined"
                  inputMode="decimal"
                  sx={{ flex: 1 }}
                  margin="normal"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{ style: { color: "text.primary" } }}
                  InputLabelProps={{ style: { color: "text.primary" } }}
                />
              </Box>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                InputProps={{ style: { color: "text.primary" } }}
                InputLabelProps={{ style: { color: "text.primary" } }}
              />
              <Box>
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend" sx={{ color: "text.primary" }}>
                    Categories
                  </FormLabel>
                  <FormGroup row>
                    {Object.keys(formData.categories).map((category) => (
                      <FormControlLabel
                        key={category}
                        control={
                          <Checkbox
                            checked={formData.categories[category]}
                            onChange={handleCheckboxChange}
                            name={category}
                          />
                        }
                        label={category}
                        sx={{ color: "text.primary" }}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  type="submit"
                  sx={{
                    textTransform: "none",
                    bgcolor: "primary.main",
                    color: "text.primary",
                    ":hover": { bgcolor: "secondary.main" },
                  }}
                >
                  Add to Listing
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SellProductForm;
