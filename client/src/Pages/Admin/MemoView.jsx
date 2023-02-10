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
  Modal,
  styled,
  Tooltip,
  Fab,
  ButtonGroup,
  Button,
} from "@mui/material";
import { getMemo } from "../../Context/features/memoSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import loaderImg from "../../assets/loader.gif";
import React, { useEffect, useState, useRef } from "react";
import parser from "html-react-parser";
import { red } from "@mui/material/colors";
import scrollreveal from "scrollreveal";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../../assets/logo.png";

const SytledModalPrint = styled(Modal)({
  display: "flex",
  alignItems: "right",
  justifyContent: "center",
  overflow: "scroll",
  overscrollBehavior: "auto",
});

const BrandBox2 = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "space-evenly",
  gap: "2px",
  marginBottom: "20px",
}));

function MemoView() {
  let count = 1;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { memo, loading, error } = useSelector((state) => ({
    ...state.memo,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const componentRef = useRef();
  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });

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
        marginTop: "1rem",
        marginBottom: "1rem",
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
          key={memo?.id * 33}
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
                <ListItem key={memo?.id * 73}>
                  <ListItemAvatar key={memo?.id * 9}>
                    <Avatar
                      sx={{ bgcolor: red[500] }}
                      aria-label="memo"
                      variant="square"
                      key={memo?.id * 113}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${cm?.firstname} ${cm?.lastname} - ${cm?.dept_name}`}
                    secondary={`${cm?.comment} \t ------> ${cm?.comment_date}`}
                    key={memo?.id * 133}
                  />
                </ListItem>
                <Divider variant="middle" key={memo?.id * 173} />
              </Box>
            );
          })}
        </List>
      )}

      <SytledModalPrint
        open={open}
        onClose={(e) => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Box
            component="form"
            bgcolor={"background.default"}
            color={"text.primary"}
            p={3}
            noValidate
            autoComplete="off"
            ref={componentRef}
          >
            <BrandBox2>
              <Box>
                <img
                  src={Logo}
                  alt="Polar Logo"
                  style={{ width: "100px", height: "100px", padding: "1px" }}
                />
              </Box>
              <Typography variant="h4" lignItems="center">
                INTERNAL MEMO
              </Typography>
              
              <Typography
                variant="subtitle"
                marginBottom={2}
                className="card"
              >
                Memo - {memo?.memo?.id}
              </Typography>
            </BrandBox2>
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
                    {`${memo?.createdBy?.firstname} `}{" "}
                    {memo?.createdBy?.lastname} - {memo?.createdBy?.dept_name}
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
                    {`${memo?.throughWho?.firstname}`}{" "}
                    {memo?.throughWho?.lastname} - {memo?.throughWho?.dept_name}
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
                key={memo?.id * 33}
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
                      <ListItem key={memo?.id * 73}>
                        <ListItemAvatar key={memo?.id * 9}>
                          <Avatar
                            sx={{ bgcolor: red[500] }}
                            aria-label="memo"
                            variant="square"
                            key={memo?.id * 113}
                          ></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${cm?.firstname} ${cm?.lastname} - ${cm?.dept_name}`}
                          secondary={`${cm?.comment} \t ------> ${cm?.comment_date}`}
                          key={memo?.id * 133}
                        />
                      </ListItem>
                      <Divider variant="middle" key={memo?.id * 173} />
                    </Box>
                  );
                })}
              </List>
            )}
          </Box>
          <ButtonGroup
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button color="error" onClick={handlePrintInvoice}>
              Print Invoice
            </Button>
            <Button
              color="error"
              sx={{ width: "100px" }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </Button>
          </ButtonGroup>
        </Box>
      </SytledModalPrint>
      <Tooltip
        onClick={(e) => {
          setOpen(true);
        }}
        title="Print Memo"
        placement="bottom"
        sx={{
          position: "fixed",
          bottom: 2,
          left: { xs: "calc(50% - 25px)", md: "50%" },
        }}
      >
        <Fab color="primary" aria-label="add">
          <PrintIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}

export default MemoView;
