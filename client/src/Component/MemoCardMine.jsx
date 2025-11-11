import React from "react";
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
import EditIcon from "@mui/icons-material/Edit";
const MemoCardMine = ({ memo }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Card sx={{
      minWidth: 275,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
      },
    }}>
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
            Options
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={()=>navigate(`/m_editmemo/${memo.memo_id}`)}>
          <EditIcon color="warning" />
          Edit Memo
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default MemoCardMine;
