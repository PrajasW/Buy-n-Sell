import React , {useState} from "react";
import { Link } from "react-router-dom";
import { Alert, TextField, Button, Box, Typography } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";

const url = "http://localhost:3081/register";

function Register() {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [error, setError] = useState("");
    
    const handleSubmit = (e) => {
        if(fname === "" || lname === "" || email === "" || dob === "" || contact === "" || password === "" || repassword === "") {
            setError("All fields are mandatory");
            // console.log("All fields are mandatory");
            return;
        }

        if((!email.endsWith("@iiit.ac.in") && !email.endsWith("@research.iiit.ac.in") && !email.endsWith("@student.iiit.ac.in") )) {
            setError("Only IIIT email ids are allowed");
            // console.log("Invalid email format");
            return;
        }
        if(password !== repassword) {
            setError("Passwords do not match");
            // console.log("Passwords do not match");
            return;
        }

        const data = {
            "firstName": fname,
            "lastName": lname,
            "email": email,
            "dateOfBirth": dob,
            "contactNumber": contact,
            "password": password
        }

        axios.post(url,data)
            .then((res) => {
                // console.log("Response: ", res);
                if(res.data.error) {
                    setError(res.data.message);
                    // console.log("Login failed");
                } else {
                    setError(res.data.message);
                    setError("");
                    // console.log("Login successful");
                    // Redirect to shop page
                    window.location.href = "/login";
                }
            })
            .catch((err) => {
                // console.log("Error: ",err.response.data.message );
                setError(err.response.data.message);
        });
        // console.log("Registration Successful");

    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                bgcolor: "background.default",
            }}
        >
            <Box
                sx={{
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
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                }}
            >
                <Typography variant="h4" gutterBottom color="text.primary">
                    Register
                </Typography>
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mt: 3,
                            fontWeight: "bold",
                            textAlign: "center",
                            borderRadius: 2,
                            width: "100%",
                            
                        }}
                        onClose={() => setError("")} // Close button for dismissing error
                    >
                        {error}
                    </Alert>
                )}
                <Box component="form" sx={{ width: "100%" }}>
                <Box
                    sx={{
                    display: "flex",
                    gap: 2, 
                    flexWrap: "wrap",
                    }}
                >
                    <TextField
                    label="First Name"
                    variant="outlined"
                    sx={{ flex: 1 }}
                    margin="normal"
                    InputProps={{ style: { color: "text.primary" } }}
                    InputLabelProps={{ style: { color: "text.primary" } }}
                    onChange={(e) => setFname(e.target.value)}
                    />
                    <TextField
                    label="Last Name"
                    variant="outlined"
                    sx={{ flex: 1 }}
                    margin="normal"
                    InputProps={{ style: { color: "text.primary" } }}
                    InputLabelProps={{ style: { color: "text.primary" } }}
                    onChange={(e) => setLname(e.target.value)}
                    />
                </Box>

                <Box
                    sx={{
                    display: "flex",
                    gap: 2, 
                    flexWrap: "wrap",
                    alignItems: "center"
                    }}
                >
                    <TextField
                    label="Phone Number"
                    variant="outlined"
                    sx={{ flex: 1 }}
                    margin="normal"s
                    InputProps={{ style: { color: "text.primary" } }}
                    InputLabelProps={{ style: { color: "text.primary" } }}
                    onChange={(e) => setContact(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date of Birth"
                        sx={{ flex: 1 }}
                        onChange={(newValue) => setDob(newValue)}
                        // onChange={(e) => setDob(e.target.value)}
                        margin = "normal"
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        InputProps={{ style: { color: "text.primary" } }}
                        InputLabelProps={{ style: { color: "text.primary" } }}
                    />
                    </LocalizationProvider>
                </Box>
                    <Box>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{ style: { color: "text.primary" } }}
                        InputLabelProps={{ style: { color: "text.primary" } }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {(!email.endsWith("@iiit.ac.in") && !email.endsWith("@research.iiit.ac.in") && !email.endsWith("@student.iiit.ac.in")) && email !== "" && (
                        <Typography variant="body2" color="warning">
                            Must be an IIIT email address.
                        </Typography>
                    )}
                    </Box>
                     <Box
                    sx={{
                    display: "flex",
                    gap: 2, 
                    flexWrap: "wrap",
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                            InputProps={{ style: { color: "text.primary" } }}
                            InputLabelProps={{ style: { color: "text.primary" } }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                         {!(password.length >= 8 && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) && password !== "" && (
                            <Typography variant="body2" color="warning">
                                Password must be at least 8 characters long and include at least one number and one special character.
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            label="Repeat Password"
                            variant="outlined"
                            sx={{ flex: 1 }}
                            type="password"
                            fullWidth
                            margin="normal"
                            InputProps={{ style: { color: "text.primary" } }}
                            InputLabelProps={{ style: { color: "text.primary" } }}
                            onChange={(e) => setRepassword(e.target.value)}
                            />
                            {!(repassword == password) && repassword !== "" && (
                               <Typography variant="body2" color="warning">
                                    Passswords Must Match
                               </Typography>
                           )}

                    </Box>

                </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 2,
                        }}
                    >
                        <Button
                            // variant="outlined"
                            component={Link}
                            to="/login"
                            sx={{
                                textTransform: "none",
                                borderColor: "primary.main",
                                color: "primary.main",
                                ":hover": { borderColor: "secondary.main", color: "secondary.main" },
                            }}
                        >
                            Already a Member?
                        </Button>
                        <Button
                            // variant = "contained"
                            variant="outlined"
                            sx={{
                                textTransform: "none",
                                bgcolor: "primary.main",
                                color: "text.primary",
                                ":hover": { bgcolor: "secondary.main" },
                            }}
                            onClick={handleSubmit}
                        >
                            Sign-up
                        </Button>
                        
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Register;
