import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import View from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../Context/features/userSlice";
import { memoNotification } from "../Context/features/memoSlice";
import { toast } from "react-toastify";

const MemoCardUser = ({ memo }) => {
  const [sendMemoTo, setSendMemoTo] = useState(null);
  const navigate = useNavigate();
  const { users } = useSelector((state) => ({ ...state.user }));
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  //function called when submit button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sendMemoTo) {
      dispatch(
        memoNotification({
          formValue: {
            memo_id: memo?.memo_id,
            user_id: sendMemoTo,
          },
          toast,
        })
      );
      setSendMemoTo(" ");
      handleClose();
    } else {
      toast.warn("please select who to send the memo to");
    }
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="memo" variant="square">
            {memo.cat_name.split("")[0]}
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            onid="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={`${memo.firstname} ${memo.lastname} - ${memo.dept_name}`}
        subheader={memo.date_created}
      />
      <Divider />
      <CardContent>
        <Typography
          sx={{ mb: 1.5 }}
          fontWeight="bold"
          color="text.primary"
          variant="subtitle1"
          gutterBottom
        >
          {memo.subject.toUpperCase()}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color:
              (memo.status === "Pending" && "orange") ||
              (memo.status === "Approved" && "green") ||
              (memo.status === "Rejected" && "red"),
          }}
        >
          {" "}
          {memo.status}{" "}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: "green",
            fontWeight: "bold" }}
        >
          {" "}
          {memo.memo_id}{" "}
        </Typography>
        <Button
          onClick={() => navigate(`/m_detailtoattend/${memo.memo_id}`)}
          variant="contained"
          sx={{ bgcolor: red[500] }}
          endIcon={<View />}
        >
          View Memo
        </Button>
      </CardActions>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Typography
            variant="subtitle"
            fontWeight="bold"
            sx={{ color: red[500] }}
          >
            Send Memo To
          </Typography>
        </MenuItem>
        <Divider />
        <TextField
          sx={{ width: "98%", display: "flex", flex: 1 }}
          id="sendMemoTo"
          select
          name="sendMemoTo"
          label="Send Memo To"
          value={sendMemoTo || ""}
          size="small"
          margin="dense"
          onChange={(e) => setSendMemoTo(e.target.value)}
        >
          {users?.map((item, index) => (
            <MenuItem value={item.id} key={item.id + 900}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {item.dept_name} -{" "}
              </Typography>{" "}
              {item.firstname} {item.lastname}
            </MenuItem>
          ))}
        </TextField>
        <Button
          alignSelf="center"
          onClick={handleSubmit}
          variant="contained"
          width="auto"
          sx={{
            display: "flex",
            bgcolor: red[500],
            marginTop: "0.5rem",
            marginLeft: { xs: "0.5rem", md: "1rem" },
            alignItems: "center",
            justifyItem: "center",
          }}
        >
          SEND MEMO
        </Button>
      </Menu>
    </Card>
  );
};

export default MemoCardUser;
