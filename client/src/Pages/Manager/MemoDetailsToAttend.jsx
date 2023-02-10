import {
  Box,
  Typography,
  Backdrop,
  Grid,
  Paper,
  Divider,
  Tooltip,
  Fab,
  styled,
  Modal,
  TextField,
  ButtonGroup,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { getMemo } from "../../Context/features/memoSlice";
import { createComment } from "../../Context/features/commentSlice";
import { getUser } from "../../Context/features/userSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import loaderImg from "../../assets/loader.gif";
import React, { useEffect, useState } from "react";
import parser from "html-react-parser";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "@mui/material/colors";
import scrollreveal from "scrollreveal";

const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const initialValue = {
  comment: "",
};
function MemoDetailToAttend() {
  let count = 1;
  const [formValue, setFormValue] = useState(initialValue);
  const { user } = useSelector((state) => ({ ...state.user }));
  const { comment } = formValue;
  const dispatch = useDispatch();
  const { id } = useParams();
  const { memo, loading, error } = useSelector((state) => ({
    ...state.memo,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [deptId, setDeptId] = useState(null);
  const [name, setName] = useState([]);

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
    let user = JSON.parse(localStorage.getItem("profile"));
    setName(user);
    setUserId(user?.result?.id);
  }, []);

  useEffect(() => {
    if (name?.result?.id) {
      dispatch(getUser(name?.result?.id));
      setDeptId(user?.dept_id);
    }
  }, [dispatch, name?.result?.id, user?.dept_id]);

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

  //function called when any input  value is changed
  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };
  //function called when submit button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id && comment && userId && deptId) {
      dispatch(
        createComment({
          formValue: {
            id,
            userId,
            deptId,
            subject: comment,
          },
          toast,
        })
      );
      setTimeout(() => {
        setOpen(false);
        dispatch(dispatch(getMemo(id)));
      }, 500);
    } else {
      toast.warn("Please check if everything is in place");
    }
  };

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
        className="card"
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
          className="card"
        >
          <Typography variance="h5" fontWeight="bold">
            Minutes
          </Typography>
          {memo?.comments?.map((cm) => {
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
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{ bgcolor: red[500] }}
                      aria-label="memo"
                      variant="square"
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${cm?.firstname} ${cm?.lastname} - ${cm?.dept_name}`}
                    secondary={`${cm?.comment} \t ------> ${cm?.comment_date}`}
                  />
                </ListItem>
                <Divider variant="middle" />
              </Box>
            );
          })}
        </List>
      )}
      <Tooltip
        onClick={(e) => {
          setOpen(true);
        }}
        title="Add Comment"
        placement="bottom"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: "50%" },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <SytledModal
        open={open}
        onClose={(e) => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={400}
          height={280}
          component="form"
          bgcolor={"background.default"}
          color={"text.primary"}
          p={3}
          noValidate
          autoComplete="off"
        >
          <Typography
            style={{ marginBottom: "1rem" }}
            variant="h4"
            textAlign="left"
          >
            Add Comment
          </Typography>

          <TextField
            sx={{ width: "100%", marginBottom: "10px" }}
            required
            type="text"
            id="comment"
            name="comment"
            label="Comment"
            multiline
            rows={2}
            value={comment || ""}
            size="small"
            margin="dense"
            onChange={onInputChange}
          />

          <ButtonGroup
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button onClick={handleSubmit}>Add Comment</Button>
            <Button
              color="error"
              sx={{ width: "100px" }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </Button>
          </ButtonGroup>
        </Box>
      </SytledModal>
    </Box>
  );
}

export default MemoDetailToAttend;
