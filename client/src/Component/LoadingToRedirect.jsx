import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(10);
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLogout = ()=>{
    localStorage.clear();  
    navigate("/")
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    count === 0 && handleLogout();
    
    return () => clearInterval(interval);
  }, [count, handleLogout, navigate]);
  return (
    <Box style={{ alignItems: "center", justifyContent:"center", display: "flex", height: "100vh"}}>
      <Typography variant="h4" textAlign="center">Redirecting you in {count} seconds</Typography>
    </Box>
  );
};

export default LoadingToRedirect;