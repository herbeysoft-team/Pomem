import React, { useState, useRef, useEffect } from "react";
import {
  Backdrop,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import JoditEditor from "jodit-react";
import { red } from "@mui/material/colors";
import { getUsers, getUser } from "../../Context/features/userSlice";
import { getCategories } from "../../Context/features/categorySlice";
import { createMemo, getMemos } from "../../Context/features/memoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loaderImg from "../../assets/loader.gif";
import scrollreveal from "scrollreveal";

const initialValue = {
  toWho: "",
  throughWho: "",
  category: "",
  subject: "",
};

const CreateMemo = () => {
  const editor = useRef(null);
  const [formValue, setFormValue] = useState(initialValue);
  const [content, setContent] = useState("");
  const { toWho, throughWho, category, subject } = formValue;
  const [userId, setUserId] = useState(null);
  const [deptId, setDeptId] = useState(null);
  const [name, setName] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const { users, user, loading, error } = useSelector((state) => ({
    ...state.user,
  }));
  const { categories } = useSelector((state) => ({ ...state.category }));
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

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
    setOpenDialog(false);
    if (toWho && category && subject && content) {
      dispatch(
        createMemo({
          formValue: {
            fromWho: userId,
            fromDept: deptId,
            toWho,
            throughWho,
            category,
            subject,
            content,
          },
          navigate,
          toast,
        })
      );
      setTimeout(() => {
        dispatch(getMemos());
      }, 500);
    } else {
      toast.warn("please fill in the neccessary details");
    }
  };

  const handleCreateMemo = () => {
    setOpenDialog(true);
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
        marginRight: { xs: "0rem", md: "20rem" },
        marginLeft: { xs: "0rem", md: "20rem" },
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

      <Typography component="h4" variant="h4" fontWeight="bold">
        Create Memo
      </Typography>

      <Grid container spacing={{ xs: 0, md: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            sx={{ width: "100%", display: "flex", flex: 1 }}
            id="toWho"
            select
            name="toWho"
            label="To"
            value={toWho || ""}
            size="small"
            margin="dense"
            onChange={onInputChange}
          >
            {users?.map((item, index) => (
              <MenuItem value={item.id} key={item.id + 300}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {item.dept_name} -{" "}
                </Typography>{" "}
                {item.firstname} {item.lastname}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            sx={{ width: "100%", display: "flex", flex: 1 }}
            id="throughWho"
            select
            name="throughWho"
            label="Through"
            value={throughWho || ""}
            size="small"
            margin="dense"
            onChange={onInputChange}
          >
            {users?.map((item, index) => (
              <MenuItem value={item.id} key={item.id + 200}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {item.dept_name} -{" "}
                </Typography>{" "}
                {item.firstname} {item.lastname}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <TextField
        sx={{ width: "100%", display: "flex", flex: 1 }}
        id="category"
        select
        name="category"
        label="Category"
        value={category || ""}
        size="small"
        margin="dense"
        onChange={onInputChange}
      >
        {categories?.map((item, index) => (
          <MenuItem value={item.id} key={item.id + 100}>
            <Typography variant="h6">{item.cat_name} </Typography>
          </MenuItem>
        ))}
      </TextField>
      <TextField
        sx={{ width: "100%" }}
        id="subject"
        label="Subject of the Memo"
        name="subject"
        placeholder="Subject of the Memo"
        multiline
        value={subject || ""}
        rows={2}
        size="small"
        margin="dense"
        onChange={onInputChange}
      />
      <Box sx={{ width: "100%" }}>
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => {}}
        />
      </Box>
      <Button
        onClick={handleCreateMemo}
        variant="contained"
        width="auto"
        sx={{ bgcolor: red[500], marginTop: "2rem" }}
      >
        Create Memo
      </Button>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to raise this memo ?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus color="error" onClick={() => setOpenDialog(false)}>
            Disagree
          </Button>
          <Button color="success" onClick={handleSubmit} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateMemo;
