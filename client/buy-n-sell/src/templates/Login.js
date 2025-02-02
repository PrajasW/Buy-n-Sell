import {React , useState} from "react";
import { data, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";

const url = "http://localhost:3081/login";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [captchaToken, setcaptchaToken ] = useState(null);
    
    const handleCaptchaChange = (value) => {
        setcaptchaToken(value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if((!email.endsWith("@iiit.ac.in") && !email.endsWith("@research.iiit.ac.in") && !email.endsWith("@student.iiit.ac.in") ) || email === "" || password === "") {
            setError("Invalid email/password format");
            return;
        }
        if(!(password.length >= 8 && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password))) {
            setError("Invalid email/password format");
            return;
        }
        if(!(captchaToken)){
            setError("Solve The Captcha");
            return;
        }
        axios.post(url,{
            email: email, 
            password: password,
            captchaToken: captchaToken
        },{
            headers: {
                "Content-Type" : "application/json"
            }
        })
            .then((res) => {
                if(res.data.error) {
                    setError(res.data.message);
                    console.log("Error: ",res.data.message);
                } else {
                    setError("");
                    // Redirect to shop page
                    console.log("Success: ",res.data.data.message);
                    localStorage.setItem("token", (res.data.data.token));
                    window.location.href = "/profile";
                }
            })
            .catch((err) => {
                // console.log("Error: ",err.response.data.message );
                setError(err.response.data.message);
            });
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
                    maxWidth: 400,
                    padding: 4,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                }}
            >
                <Typography variant="h4" gutterBottom color="text.primary">
                    Log-in
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
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{ style: { color: "text.primary" } }}
                        InputLabelProps={{ style: { color: "text.primary" } }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {(!email.endsWith("@iiit.ac.in") && !email.endsWith("@research.iiit.ac.in") && !email.endsWith("@student.iiit.ac.in") )  && email !== "" && (
                        <Typography variant="body2" color="warning">
                            Must be an IIIT email address.
                        </Typography>
                    )}
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
                       <ReCAPTCHA
                        sitekey="6Lfxw8kqAAAAAD8lG2moN_BVe61kEgWICnzu2_lJ"
                        onChange={handleCaptchaChange}
                        />
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
                            to="/register"
                            sx={{
                                textTransform: "none",
                                borderColor: "primary.main",
                                color: "primary.main",
                                ":hover": { borderColor: "secondary.main", color: "secondary.main" },
                            }}
                        >
                            Not a member?
                        </Button>
                        <Button
                            // variant="contained"
                            variant="outlined"
                            // component={Link}
                            // to="/shop"
                            sx={{
                                textTransform: "none",
                                bgcolor: "primary.main",
                                color: "text.primary",
                                ":hover": { bgcolor: "secondary.main" },
                            }}
                            onClick={handleSubmit}
                        >
                            Log-in
                        </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default Login;
