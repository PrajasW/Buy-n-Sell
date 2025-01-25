import React from 'react';
import Navbar from './Navbar';
import { Box , Button, Container, Hidden, Paper, Alert} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';


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
  

const getItem = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3081/item/${id}`);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


function Item() {
    const {id} = useParams();
    // console.log(id)
    const [item, setItem] = React.useState({
        _id: "",
        name: "",
        sellerID: "",
        price: "",
        description: "",
    });
    React.useEffect(() => {
        getInfo();
        getItem(id).then((data) => {
            setItem(data);
        });
    }, []);
    
    const [error, setError] = React.useState(null);

    const addToCart = async (itemId) => {
        const token = localStorage.getItem("token");
        const url = "http://localhost:3081/addToCart";
        try {
            const response = await axios.put(
                url,
                { _id: itemId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    },
                }
            );
    
            if (response.status === 200) {
                console.log(response.data);
                setError("");
                // redirect
                window.location.href = "/cart";
                // alert("Item added to cart successfully!");
            } else {
                console.error("Failed to add item to cart:", response.data.message);
                setError(response.data.message);
                // alert("Failed to add item to cart!");
            }
        } catch (error) {
            setError(error.response.data.message);
            console.error("Error while adding to cart:", error);
            // alert("An error occurred. Please try again.");
        }
    };
    
    return (
        <Box>
            <Navbar />
            <Box sx={{
                backgroundColor: "background.default",
                minHeight: "100vh",
                py: 4,
            }}>
            <Container maxWidth="lg">
                  {error && (
                    <Alert
                        severity="error"
                        sx={{
                            color: "error",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "center",
                            width: "90%",
                            mb: 2,
                        }}
                        onClose={() => setError("")} // Close button for dismissing error
                    >
                        {error}
                    </Alert>
                )}
                <Paper sx={{ padding: 4}}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}> 
                        <Box>
                            <h1>
                                {item.name}
                            </h1>
                            <h3>by {item.sellerID}</h3>
                        </Box>
                        <h1>₹{item.price}</h1>
                    </Box>
                    <h4>{item.description}</h4>
                <Box sx={{ display: "flex", justifyContent: "right" }}>    
                <Button variant="contained" color="primary" key={item._id} onClick={() => addToCart(item._id)} >Add To Cart</Button>
                </Box>
                </Paper>
            </Container>
            </Box>
        </Box>
    );
};

export default Item;