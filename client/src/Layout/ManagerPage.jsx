import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import {
  AppBar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  styled,
  ToggleButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { darkTheme, lightTheme } from "../Context/features/themeSlice";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FooterMenu from "../Component/FooterMenu";
import { CiMemoPad } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { getMemosToAttend } from "../Context/features/memoSlice";

const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

export default function ManagerPage(props) {
  const theme = useTheme();
  const [modeSelected, setModeSelected] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memosToAttend } = useSelector((state) => ({ ...state.memo }));

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("profile"));
    setName(user);
    setUserId(user?.result?.id);
  }, []);

  useEffect(() => {
    if (name?.result?.id) {
      dispatch(getMemosToAttend(name?.result?.id));
    }
  }, [dispatch, name?.result?.id]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box>
      <AppBar position="fixed" color="primary" sx={{ top: 0 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: theme.palette.primary.main,
            gap: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              noWrap
              component="div"
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <CiMemoPad color="#fff" size={32} />
              POMEM
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              noWrap
              component="div"
              sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
            >
              <CiMemoPad color="#fff" size={24} />
              POMEM
            </Typography>
          </Box>
          <Icons>
            <ToggleButton
              value="check"
              selected={modeSelected}
              onChange={() => {
                setModeSelected(!modeSelected);
                if (modeSelected) {
                  dispatch(lightTheme());
                } else {
                  dispatch(darkTheme());
                }
              }}
            >
              {modeSelected ? (
                <DarkModeIcon color="inherit" />
              ) : (
                <LightModeIcon color="inherit" />
              )}
            </ToggleButton>
            <Badge
              badgeContent={memosToAttend?.length}
              color="error"
              onClick={(e) => navigate("/m_attendto")}
            >
              <NotificationsIcon color="inherit" />
            </Badge>
            <IconButton
              aria-label="options"
              color="inherit"
              onClick={(e) => setOpenOption(true)}
            >
              <MoreVertIcon />
            </IconButton>
          </Icons>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            open={openOption}
            onClose={(e) => setOpenOption(false)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => navigate(`/m_edit/${userId}`)}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {props.children}
      <FooterMenu />
    </Box>
  );
}
