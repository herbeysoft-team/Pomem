import {
  Box,
  Typography,
  Backdrop,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { getMemo } from "../../Context/features/memoSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import loaderImg from "../../assets/loader.gif";
import React, { useEffect, useState } from "react";
import parser from "html-react-parser";
import { red } from "@mui/material/colors";
import scrollreveal from "scrollreveal";

function MemoDetail() {
  let count = 1;
  const dispatch = useDispatch();
  const { id } = useParams();
  const { memo, loading, error } = useSelector((state) => ({
    ...state.memo,
  }));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(
      `
        .card
    `,
      {
        opacity: 0,
        interval: 100,
      }
    );
  }, []);
  useEffect(() => {
    if (id) {
      if (count < 2) {
        dispatch(getMemo(id));
      }
    }
    count++;
  }, [count, dispatch, id]);

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
        justifyItems: "center",
        alignItems: "center",
        marginTop: "5rem",
        marginBottom: "5rem",
        padding: { xs: "1rem", md: "2rem" },
        marginRight: { xs: "0rem", md: "15rem" },
        marginLeft: { xs: "0rem", md: "15rem" },
      }}
      className="card"
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
        fontWeight="bold"
        className="card"
      >
        Memo
      </Typography>
      <Typography
        variant="subtitle"
        marginBottom={2}
        className="card"
      >
        Memo - {memo?.memo?.id}
      </Typography>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "start",
          marginTop: "1rem",
          padding: { xs: "1rem", md: "1rem" },
        }}
      >
        <Grid container spacing={{ xs: 0, md: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant={{ xs: "subtitle2", md: "h6" }}>
              <span sx={{ fontWeight: "bold" }}>FROM : </span>{" "}
              {`${memo?.createdBy?.firstname} `} {memo?.createdBy?.lastname} -{" "}
              {memo?.createdBy?.dept_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant={{ xs: "subtitle2", md: "h6" }}>
              <span sx={{ fontWeight: "bold" }}>TO : </span>{" "}
              {`${memo?.toWho?.firstname} `} {memo?.toWho?.lastname} -{" "}
              {memo?.toWho?.dept_name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={{ xs: 0, md: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant={{ xs: "subtitle2", md: "h6" }}>
              <span sx={{ fontWeight: "bold" }}>DATE : </span>{" "}
              {memo?.memo?.date_created.split(",")[0]}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant={{ xs: "subtitle2", md: "h6" }}>
              <span sx={{ fontWeight: "bold" }}>THROUGH : </span>{" "}
              {`${memo?.throughWho?.firstname}`} {memo?.throughWho?.lastname} -{" "}
              {memo?.throughWho?.dept_name}
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyItems: "start",
          }}
        >
          <Typography variant={{ xs: "subtitle2", md: "h6" }}>
            <span sx={{ fontWeight: "bold" }}>
              {" "}
              SUBJECT : {memo?.memo?.subject.toUpperCase()}{" "}
            </span>
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyItems: "start",
            marginTop: "2rem",
          }}
        >
          {parser(`${memo?.memo?.content}`)}
        </Box>
      </Paper>
      {memo?.comments?.length > 0 && (
        <List
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "start",
            marginTop: "1rem",
            padding: { xs: "0rem", md: "1rem" },
            bgcolor: "background.paper",
          }}
          key={memo?.id * 3}
        >
          <Typography variance="h5" fontWeight="bold">
            Minutes
          </Typography>
          {memo?.comments?.map((cm, index) => {
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "start",
                  alignItems: "center",
                  bgcolor: "background.paper",
                }}
                key={index}
              >
                <ListItem key={memo?.id * 7}>
                  <ListItemAvatar key={memo?.id * 9}>
                    <Avatar
                      sx={{ bgcolor: red[500] }}
                      aria-label="memo"
                      variant="square"
                      key={memo?.id * 11}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${cm?.firstname} ${cm?.lastname} - ${cm?.dept_name}`}
                    secondary={`${cm?.comment} \t ------> ${cm?.comment_date}`}
                    key={memo?.id * 13}
                  />
                </ListItem>
                <Divider variant="middle" key={memo?.id * 17} />
              </Box>
            );
          })}
        </List>
      )}
    </Box>
  );
}

export default MemoDetail;
