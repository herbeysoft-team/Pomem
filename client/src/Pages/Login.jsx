import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Paper,
  Typography,
  Container,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Context/features/authSlice";
import { Backdrop } from "@mui/material";
import loaderImg from "../assets/loader.gif";
import { CiMemoPad } from "react-icons/ci";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";

const initialState = {
  email: "",
  password: "",
};

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"© "}
      <Link color="inherit" href="https://polarpetrochemicalsltd.com">
        POMEM
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
      <IntegrationInstructionsOutlinedIcon color="error" />
      <Link color="inherit" href="https://www.instagram.com/herbeysoft/">
        by ICT Team
      </Link>
    </Typography>
  );
}

export default function Login() {
  const [formValue, setFormValue] = useState(initialState);
  const { email, password } = formValue;
  const { loading, error } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loading && setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Please enter your details");
    } else {
      dispatch(login({ formValue, navigate, toast }));
    }
  };

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  return (
    <Container maxWidth="xs" component="div">
      <Box
        marginTop="5rem"
        marginBottom="1rem"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <img src={loaderImg} alt="Loading..." />
          </Backdrop>
        )}
        <Typography
          variant="h2"
          color="#d70e05"
          alignItems="center"
          sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
        >
          <CiMemoPad color="#d70e05" size={64} />
          POMEM
        </Typography>
      </Box>
      <Box
        component={Paper}
        elevation={2}
        sx={{
          marginTop: 2,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingX: 4,
          paddingY: 10,
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username or Email Address"
            name="email"
            onChange={onInputChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={onInputChange}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Sign In
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 1 }} />
    </Container>
  );
}
