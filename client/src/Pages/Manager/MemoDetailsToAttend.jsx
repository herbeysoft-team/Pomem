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
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { getMemo, updateMemoStatus } from "../../Context/features/memoSlice";
import { createComment } from "../../Context/features/commentSlice";
import { getUser, getUsers } from "../../Context/features/userSlice";
import { memoNotification } from "../../Context/features/memoSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const approvedStatus = "Approved";
  const rejectedStatus = "Rejected";
  let count = 1;
  const [formValue, setFormValue] = useState(initialValue);
  const { user, users } = useSelector((state) => ({ ...state.user }));
  const { comment } = formValue;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { memo, loading } = useSelector((state) => ({
    ...state.memo,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [deptId, setDeptId] = useState(null);
  const [name, setName] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [mentionList, setMentionList] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionedUsers, setMentionedUsers] = useState([]);
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
      dispatch(getUsers());
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

  // useEffect(() => {
  //   error && console.log(error);
  // }, [error]);

  //function called when any input  value is changed
  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
    // detect mention trigger
    const mentionMatch = value.match(/@(\w{3,})$/); // @ followed by at least 3 characters
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      const filtered = users.filter((u) =>
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(query)
      );
      setMentionList(filtered);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleSelectMention = (user) => {
    const updatedComment = comment.replace(/@\w{3,}$/, `@${user.firstname}${user.lastname} `);
    setFormValue({ ...formValue, comment: updatedComment });
    setShowMentions(false);
    setMentionedUsers((prev) => [...new Set([...prev, user.id])]);
  };

  //function called when submit button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id && comment && userId && deptId) {
      // ✅ Ensure it's an array and not empty
      if (Array.isArray(mentionedUsers) && mentionedUsers.length > 0) {
        mentionedUsers.forEach((sendMemoTo) => {
          dispatch(
            memoNotification({
              formValue: {
                memo_id: id, // or memo?.memo_id if available
                user_id: sendMemoTo,
              },
              toast,
            })
          );
        });
      }
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

  // Function for Final Approval
  const handleFinalApproval = async (e) => {
    e.preventDefault();
    setOpenDialog(false);
    try {
      if (!id) return toast.warn("No memo selected.");
      // Example payload, adjust to match your API or Redux action
      dispatch(
        updateMemoStatus({
          memoId: id,
          updatedValue: {
            status: approvedStatus,
          },
          toast,
          navigate,
        })
      );

    } catch (error) {
      console.error(error);
      toast.error("Failed to approve memo.");
    }
  };

  // Function for Rejection
  const handleRejectMemo = async (e) => {
    e.preventDefault();
    setOpenDialog1(false);
    try {
      if (!id) return toast.warn("No memo selected.");
      dispatch(
        updateMemoStatus({
          memoId: id,
          updatedValue: {
            status: rejectedStatus,
          },
          toast,
          navigate,
        })
      );

    } catch (error) {
      console.error(error);
      toast.error("Failed to reject memo.");
    }
  };

  const handleFinalApprovalDialog = () => {
    setOpenDialog(true);
  };

  const handleRejectApprovalDialog = () => {
    setOpenDialog1(true);
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
        width: "100%", // take full width
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
              <span style={{ fontWeight: 800, color: "orange" }}>FROM : </span>{" "}
              {`${memo?.createdBy?.firstname} `} {memo?.createdBy?.lastname} -{" "}
              {memo?.createdBy?.dept_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant={{ xs: "subtitle2", md: "h6" }}>
              <span style={{ fontWeight: 800, color: "orange" }}>TO : </span>{" "}
              {`${memo?.toWho?.firstname} `} {memo?.toWho?.lastname} -{" "}
              {memo?.toWho?.dept_name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={{ xs: 0, md: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant={{ xs: "subtitle2", md: "h6" }}>
              <span style={{ fontWeight: 800, color: "orange" }}>DATE : </span>{" "}
              {memo?.memo?.date_created.split(",")[0]}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant={{ xs: "subtitle2", md: "h6" }}>
              <span style={{ fontWeight: 800, color: "orange" }}>THROUGH : </span>{" "}
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
            <span style={{ fontWeight: 800, color: "orange" }}>
              {" "}
              SUBJECT : 
            </span>
            {" "}{memo?.memo?.subject.toUpperCase()}{" "}
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
          {memo?.comments?.map((cm, index) => {
            return (
              <Box
                key={index}
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
            label="Use @ followed by a name to mention someone (e.g., @John)"
            multiline
            rows={2}
            value={comment || ""}
            size="small"
            margin="dense"
            onChange={onInputChange}
          />
          {/* Mention Dropdown */}
          {showMentions && mentionList.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "70%",
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "80%", md: "40%", lg: "30%" },
                maxHeight: 150,
                overflowY: "auto",
                zIndex: 999,
              }}
            >
              <List>
                {mentionList.map((user) => (
                  <ListItem
                    button
                    key={user.id}
                    onClick={() => handleSelectMention(user)}
                  >
                    {user.firstname} {user.lastname} - {user.dept_name}
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          marginTop: "2rem",
          flexWrap: "nowrap",
        }}
      >
        {/* 📝 Edit Memo Button (Only for memo creator) */}
        {userId === memo?.memo?.raised_by ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "orange",
              color: "white",
              "&:hover": {
                backgroundColor: "green",
              },
              textTransform: "none",
              px: 3,
            }}
            onClick={() => navigate(`/m_editmemo/${memo?.memo?.id}`)}
          >
            📝 Edit Memo
          </Button>
        ) : (
          <>
            {/* ✅ Final Approval Button (Only for recipient) */}
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  userId === memo?.memo?.toWho && memo?.comments?.length > 0
                    ? "green"
                    : "grey",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    userId === memo?.memo?.toWho && memo?.comments?.length > 0
                      ? "darkgreen"
                      : "grey",
                },
                textTransform: "none",
                px: 3,
              }}
              onClick={handleFinalApprovalDialog}
              disabled={!(userId === memo?.memo?.toWho && memo?.comments?.length > 0)}
            >
              ✅ Give Final Approval
            </Button>

            {/* ❌ Reject Memo Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  userId === memo?.memo?.toWho && memo?.comments?.length > 0
                    ? "red"
                    : "grey",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    userId === memo?.memo?.toWho && memo?.comments?.length > 0
                      ? "darkred"
                      : "grey",
                },
                textTransform: "none",
                px: 3,
              }}
              onClick={handleRejectApprovalDialog}
              disabled={!(userId === memo?.memo?.toWho && memo?.comments?.length > 0)}
            >
              ❌ Reject Memo
            </Button>
          </>
        )}
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to give final approval ?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus color="error" onClick={() => setOpenDialog(false)}>
            Disagree
          </Button>
          <Button color="success" onClick={handleFinalApproval} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog1}
        onClose={() => setOpenDialog1(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to reject the memo? ?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus color="error" onClick={() => setOpenDialog1(false)}>
            Disagree
          </Button>
          <Button color="success" onClick={handleRejectMemo} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default MemoDetailToAttend;
