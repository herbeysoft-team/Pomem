import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CreateIcon from "@mui/icons-material/Create";
import WindowIcon from "@mui/icons-material/Window";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import Paper from "@mui/material/Paper";

const FooterMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("profile"));
    setUserId(user?.result?.id);
  }, []);

  // Map index → route (for navigation)
  const indexToRoute = [
    "/m_dashboard",
    "/m_mymemo",
    "/m_create",
    "/m_attendto",
    userId ? `/m_edit/${userId}` : "/m_edit",
  ];

  // Determine active tab based on current URL
  const value = useMemo(() => {
    if (location.pathname === "/m_dashboard") return 0;
    if (location.pathname === "/m_mymemo") return 1;
    if (location.pathname === "/m_create") return 2;
    if (location.pathname === "/m_attendto") return 3;
    if (location.pathname.startsWith("/m_edit")) return 4; // ✅ handle dynamic route
    return 0;
  }, [location.pathname]);

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          navigate(indexToRoute[newValue]);
        }}
      >
        <BottomNavigationAction label="Home" icon={<WindowIcon />} />
        <BottomNavigationAction label="Mine" icon={<IndeterminateCheckBoxIcon />} />
        <BottomNavigationAction label="Create" icon={<CreateIcon />} />
        <BottomNavigationAction label="Attend" icon={<ReceiptLongIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default FooterMenu;
