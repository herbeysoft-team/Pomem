import React, { useState, useRef } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CreateIcon from "@mui/icons-material/Create";
import WindowIcon from "@mui/icons-material/Window";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Paper from "@mui/material/Paper";

import { useNavigate } from "react-router-dom";

const FooterMenu = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const ref = useRef();

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue === 0) {
            navigate("/m_dashboard");
          } else if (newValue === 1) {
            navigate("/m_create");
          } else if (newValue === 2) {
            navigate("/m_mymemo");
          } else if (newValue === 3) {
            navigate("/m_attendto");
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<WindowIcon />} />
        <BottomNavigationAction label="Create" icon={<CreateIcon />} />
        <BottomNavigationAction
          label="Mine"
          icon={<IndeterminateCheckBoxIcon />}
        />
        <BottomNavigationAction label="Attend" icon={<ReceiptLongIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default FooterMenu;
