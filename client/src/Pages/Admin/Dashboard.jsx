import styled from "@emotion/styled";
import { Box, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CardItem from "../../Component/CardItem";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import { getUsersCount } from "../../Context/features/userSlice";
import { getMemosCount } from "../../Context/features/memoSlice";
import { useSelector, useDispatch } from "react-redux";
import { Backdrop } from "@mui/material";
import loaderImg from "../../assets/loader.gif";
import { toast } from "react-toastify";
import PieMemo from "../../Component/PieMemo";
import scrollreveal from "scrollreveal";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "pallete.primary" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Wrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(1),
  top: 0,
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const { userscount, loading, error } = useSelector((state) => ({
    ...state.user,
  }));
  const { memoscount } = useSelector((state) => ({
    ...state.memo,
  }));
  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(
      `
        .grid
    `,
      {
        opacity: 0,
        interval: 100,
      }
    );
  }, []);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getUsersCount());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMemosCount());
  }, [dispatch]);

  useEffect(() => {
    loading && setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyItems: "center",
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
        component="h4"
        variant="h4"
        textAlign="center"
        sx={{ fontWeight: "bold" }}
      >
        Dashboard
      </Typography>
      <Wrapper>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} className="grid">
            <Item>
              <CardItem
                name="ADMIN"
                icon={<AdminIcon />}
                number={userscount?.Admin}
                bgavatar="red"
                numberColor="red"
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} className="grid">
            <Item>
              <CardItem
                name="MANAGERS"
                icon={<AdminIcon />}
                number={userscount?.Manager}
                bgavatar="red"
                numberColor="red"
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} className="grid">
            <Item>
              <CardItem
                name="STAFF"
                icon={<AdminIcon />}
                number={userscount?.Staff}
                bgavatar="red"
                numberColor="red"
              />
            </Item>
          </Grid>
        </Grid>
        <Box mt={2}></Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} className="grid">
            <Item>
              <CardItem
                name="ALL MEMOS"
                icon={<AdminIcon />}
                number={memoscount.AllMemos}
                bgavatar="red"
                numberColor="red"
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} className="grid">
            <Item>
              <CardItem
                name="APPROVED MEMOS"
                icon={<AdminIcon />}
                number={memoscount.Approved}
                bgavatar="red"
                numberColor="red"
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} className="grid">
            <Item>
              <CardItem
                name="PENDING MEMOS"
                icon={<AdminIcon />}
                number={memoscount.Pending}
                bgavatar="red"
                numberColor="red"
              />
            </Item>
          </Grid>
        </Grid>
        <Box mt={2}></Box>
        <Paper elevation={2} sx={{ p: 2, gridColumn: "1/3" }} className="grid">
          <PieMemo />
        </Paper>
      </Wrapper>
    </Box>
  );
};

export default Dashboard;
