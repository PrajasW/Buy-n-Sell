import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    TextField,
    Button,
    Box,
    Typography,
    Container,
    Alert,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Navbar from "./Navbar";

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

function Profile() {
    // send a request to the server to get the user profile data
    const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        dateOfBirth: new Date(),
        password: "",
        confirmPassword: ""
    });

    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [recoveryData,setRecoveryData] = useState({
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        dateOfBirth: new Date()
    });

    const [changes, setChanges] = useState(false);

    useEffect(() => {
        getInfo().then((data) => {
            const date = new Date(data.dateOfBirth);
            console.log(data.dateOfBirth)
            setProfileData({
                firstName: data.firstName,
                lastName: data.lastName,
                contactNumber: data.contactNumber,
                dateOfBirth: date,
                email: data.email,
            });
            setRecoveryData({
                firstName: data.firstName,
                lastName: data.lastName,
                contactNumber: data.contactNumber,
                dateOfBirth: date,
                email: data.email,
            });
        });
    }, []);
        

    const handleEditToggle = () => {
        setIsEditing(!isEditing);

    };

    const handleCancelToggle = () => {
        setIsEditing(false);
        setProfileData({
            firstName: recoveryData.firstName,
            lastName: recoveryData.lastName,
            contactNumber: recoveryData.contactNumber,
            dateOfBirth: recoveryData.dateOfBirth,
            email: recoveryData.email,
        });
        setPassword("");
        setConfirmPassword("");
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDateChange = (newValue) => {
        setProfileData((prevState) => ({
            ...prevState,
            dateOfBirth: newValue.toDate(),
        }));
    };

    const handleSave = async () => {
        setIsEditing(false);
        setRecoveryData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            contactNumber: profileData.contactNumber,
            dateOfBirth: profileData.dateOfBirth,
            email: profileData.email,
        });
        console.log(password);
        setPassword("");
        setConfirmPassword("");
        setChanges(true);
        // You can also make an API call here to save the data
        const token = localStorage.getItem("token");
        const data = {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            contactNumber: profileData.contactNumber,
            dateOfBirth: profileData.dateOfBirth
        }
        if(password){
            data.password = password;
        }
        try {
            
            const response = await axios.put("http://localhost:3081/updateProfile", data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                }
            });
            // console.log(response);
    
            if (response.data.error) {
                console.log("Error: ", response.data.message);
                return null;
            }
    
            return response.data.data;
        } catch (error) {
            if (error.response) {
                console.log(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
                console.log("Error Message: ", error.response.data?.message || "Unknown error");
                // naviate to logout
                // window.location.href = "/logout";
            } else if (error.request) {
                console.log("No response from server.");
            } else {
                console.log("Error: ", error.message);
            }
            return null; 
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
                    {!isEditing ? (
                        // View Mode
                        <Box sx={{display:"flex" ,justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                            {changes && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        color: "success.main",
                                        fontWeight: "bold",
                                        display: "flex",
                                        justifyContent: "center",
                                        width: "90%",
                                        mb: 2,
                                    }}
                                    onClose={() => setChanges(false)} // Close button for dismissing error
                                >
                                    Changes Saved
                                </Alert>
                            )}
                            <Container sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "90%",
                                maxWidth: 700,
                                padding: 4,
                                bgcolor: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                borderRadius: 2,
                                //   boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                            }}>
                            <Typography variant="h4">Name : {profileData.firstName} {profileData.lastName}</Typography>
                            <Typography variant="h4">Email : {profileData.email}</Typography>
                            <Typography variant="h4">Phone : {profileData.contactNumber}</Typography>
                            {/* <Typography variant="h4">DOB: {profileData.dateOfBirth.toLocaleDateString()}</Typography> */}
                            <Typography variant="h4">
                                DOB: {profileData.dateOfBirth ? dayjs(profileData.dateOfBirth).format("DD/MM/YYYY")  : "N/A"}
                            </Typography>

                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                onClick={handleEditToggle}
                                sx={{
                                    mt: 2,
                                    textTransform: "none",
                                }}
                            >
                                Edit Profile
                            </Button>
                            </Container>
                        </Box>
                    ) : (
                        // Edit Mode
                        <Container sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "90%",
                            maxWidth: 700,
                            padding: 4,
                            bgcolor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            borderRadius: 2,
                          //   boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                      }}>
                        <Box component="form" sx={{ width: "100%" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    sx={{ flex: 1 }}
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    sx={{ flex: 1 }}
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mt: 2,
                                }}
                            >
                                <TextField
                                    label="Phone Number"
                                    variant="outlined"
                                    sx={{ flex: 1 }}
                                    value={profileData.contactNumber}
                                    name="contactNumber"
                                    onChange={handleInputChange}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker sx={{flex:1}}
                                        label="Date of Birth"
                                        value={dayjs(profileData.dateOfBirth)}
                                        onChange={handleDateChange}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>
                            
                            {/* <Box sx={{ mt: 2 }}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                />
                            </Box> */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" color="body.secondary">Change Password (ignore if don't want to)</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mt: 2,
                                }}
                            >
                                <Box sx={{ flex: 1, width: "100%" }}>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    name="password"
                                    sx = {{width: "100%"}}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {!(password.length >= 8 && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) && password !== "" && (
                                    <Typography variant="body2" color="warning">
                                        Password must be at least 8 characters long and include at least one number and one special character.
                                    </Typography>
                                )}
                                </Box>
                                <Box sx={{ flex: 1, width: "100%" }}>
                                <TextField
                                    label="Repeat Password"
                                    variant="outlined"
                                    type="password"
                                    sx={{ width: "100%" }}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {!(confirmPassword == password) && confirmPassword !== "" && (
                                    <Typography variant="body2" color="warning">
                                        Passswords Must Match
                                    </Typography>
                                )}
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    mt: 3,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleCancelToggle}
                                    sx={{
                                        textTransform: "none",
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{
                                        textTransform: "none",
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                    )}
                </Container>
            </Box>
        </Box>
    );
}

export default Profile;
