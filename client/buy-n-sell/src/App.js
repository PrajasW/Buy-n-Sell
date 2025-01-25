import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Import pages (create these as separate components)
import Login from "./templates/Login";
import Register from "./templates/Register";
import Logout from "./templates/Logout";
import Profile from "./templates/Profile";
import Shop from "./templates/Shop";
import History from "./templates/History";
import Delivery from "./templates/Delivery";
import Cart from "./templates/Cart";
import Support from "./templates/Support";
import Sell from "./templates/Sell"
import Item from './templates/Item';
import ShopView from './templates/ShopView';
import axios from "axios";

const theme = createTheme({
  typography: {
      fontFamily: "'Oswald', 'Quattrocento', sans-serif",
      h4: {
          fontFamily: "'Oswald', sans-serif",
      },
      body1: {
          fontFamily: "'Quattrocento', serif",
      },
  },
  palette: {
      background: {
          default: "rgb(249, 246, 239)",
      },
      text: {
          primary: "rgb(38, 25, 17)",
      },
      primary: {
        main: "rgb(191, 175, 160)",
      },
      secondary: {
        main: "rgb(102, 74, 50)",
      },
  },
});

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    return token ? <Navigate to="/profile" /> : children;
}

function App() {
    return (
        <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/profile" replace />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/logout" element={<PrivateRoute> <Logout /> </PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
                <Route path="/shop" element={<PrivateRoute> <Shop /> </PrivateRoute>} />
                <Route path="/history" element={<PrivateRoute> <History /> </PrivateRoute>} />
                <Route path="/delivery" element={<PrivateRoute> <Delivery /> </PrivateRoute>} />
                <Route path="/cart" element={<PrivateRoute> <Cart /> </PrivateRoute>} />
                <Route path="/support" element={<PrivateRoute> <Support /> </PrivateRoute>} />
                <Route path="/sell" element={<PrivateRoute> <Sell /> </PrivateRoute>} />
                <Route path="/item/:id" element={<PrivateRoute><Item /></PrivateRoute>} />


            </Routes>
        </Router>
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Caveat&family=Itim&family=Oswald:wght@200..700&family=Roboto&display=swap" rel="stylesheet"/>
        </ThemeProvider>
    );
}

export default App;
