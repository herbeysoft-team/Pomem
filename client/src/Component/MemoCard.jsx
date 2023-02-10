import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { CardHeader, Divider, IconButton} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import View from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";

const MemoCard = ({ memo }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ minWidth: 275 }} className="card">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="memo" variant="square">
            {memo.cat_name.split("")[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
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
          onClick={() => navigate(`/m_detail/${memo.memo_id}`)}
          variant="contained"
          sx={{ bgcolor: red[500] }}
          endIcon={<View />}
        >
          View Memo
        </Button>
      </CardActions>
    </Card>
  );
};

export default MemoCard;
