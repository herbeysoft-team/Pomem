import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { CardHeader, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import View from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";
import Rejected from "@mui/icons-material/DisabledByDefault";
import Approved from "@mui/icons-material/CheckBox";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  updateMemoStatus,
  getMemosByUser,
} from "../Context/features/memoSlice";
const MemoCardMine = ({ memo }) => {
  const approvedStatus = "Approved";
  const rejectedStatus = "Rejected";
  const [name, setName] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
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
    let user = JSON.parse(localStorage.getItem("profile"));
    setName(user);
    setUserId(user?.result?.id);
  }, []);

  const handleApproved = () => {
    dispatch(
      updateMemoStatus({
        memoId: memo?.memo_id,
        updatedValue: {
          status: approvedStatus,
        },
        toast,
        navigate,
      })
    );
    dispatch(getMemosByUser(name?.result?.id));
    handleClose();
  };

  const handleRejected = () => {
    dispatch(
      updateMemoStatus({
        memoId: memo?.memo_id,
        updatedValue: {
          status: rejectedStatus,
        },
        toast,
        navigate,
      })
    );
    dispatch(getMemosByUser(name?.result?.id));
    handleClose();
  };
  return (
    <Card sx={{ minWidth: 275 }} className="card">
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
            Change Status
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleApproved}>
          <Approved color="success" />
          Approved
        </MenuItem>
        <MenuItem onClick={handleRejected}>
          <Rejected color="error" />
          Rejected
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default MemoCardMine;
