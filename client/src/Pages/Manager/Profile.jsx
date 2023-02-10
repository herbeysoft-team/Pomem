import React, { useEffect, useState } from "react";
import { getUserProfile, updateUser } from "../../Context/features/userSlice";
import { passwordChange } from "../../Context/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Modal,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyIcon from "@mui/icons-material/Key";
import loaderImg from "../../assets/loader.gif";

const Wrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(1),
  top: 0,
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(2),
  },
}));

const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  bood_group: "",
  address: "",
  birthday: "",
  nin: "",
  photo: "",
  username: "",
};

const initialPass = {
  fpassword: "",
  cpassword: "",
};

const Profile = () => {
  const [formValue, setFormValue] = useState(initialState);
  const [formPass, setFormPass] = useState(initialPass);
  const { fpassword, cpassword } = formPass;
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const navigate = useNavigate();
  const {
    firstname,
    lastname,
    middlename,
    email,
    password,
    phone_no,
    role,
    username,
    dept_id,
  } = formValue;
  const { user, loading, error } = useSelector((state) => ({ ...state.user }));
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getUserProfile(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormValue(user);
    }
  }, [user]);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  useEffect(() => {
    loading && setIsLoading(loading);
  }, [loading]);

  //function called when any input  value is changed
  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  //function called when any input  value is changed
  const onInputChangePassword = (e) => {
    let { name, value } = e.target;
    setFormPass({ ...formPass, [name]: value });
  };

  //function called when submit button is clicked
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (firstname && lastname && email) {
      //const updatedFormValue = { ...formValue }
      if (id) {
        dispatch(
          updateUser({
            userId: id,
            updatedValue: {
              firstname,
              lastname,
              middlename,
              email,
              password,
              phone_no,
              role,
              username,
              dept_id,
            },
            toast,
          })
        );
      }
      setTimeout(() => {
        navigate("/m_dashboard");
        toast.success("Profile Updated Successfully");
      }, 1000);
    }
  };

  //function called when submit button is clicked
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (fpassword === cpassword) {
      dispatch(
        passwordChange({
          formValue: {
            id,
            fpassword,
          },
        })
      );
      setTimeout(() => {
        navigate("/m_dashboard");
        toast.success("Passowrd Changed Successfully");
        setOpen2(false);
      }, 1000);
    } else {
      toast.warning("Passowrd did not match");
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
      <Typography
        component="h4"
        variant="h4"
        textAlign="center"
        sx={{ fontWeight: "bold" }}
      >
        My Profile
      </Typography>
      <Wrapper>
        <Grid container spacing={2} marginY={2}>
          <Grid item xs={12} md={6} className="grid">
            <Avatar
              sx={{ width: "200px", height: "200px" }}
              aria-label="memo"
              variant="square"
            ></Avatar>
          </Grid>
          <Grid item xs={12} md={6} className="grid">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyItems: "start",
                padding: { xs: "0rem", md: "2rem" },
              }}
            >
              <Typography variant="subtitle1">
                FULL NAME : {user?.firstname} {user?.middlename}{" "}
                {user?.lastname}
              </Typography>
              <Typography variant="subtitle1">
                EMAIL ADDRESS : {user?.email}
              </Typography>
              <Typography variant="subtitle1">
                USERNAME : {user?.username}
              </Typography>
              <Typography variant="subtitle1">
                PHONE NUMBER : {user?.phone_no}
              </Typography>
              <Typography variant="subtitle1">
                DEPARTMENT : {user?.dept_name}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <ButtonGroup
          fullWidth
          variant="contained"
          aria-label="outlined primary button group"
          margin="20px"
        >
          <Button color="error" onClick={() => setOpen(true)}>
            Edit Profile
          </Button>
          <Button color="error" onClick={() => setOpen2(true)}>
            {" "}
            Change Password
            <KeyIcon />
          </Button>
        </ButtonGroup>
        <SytledModal
          open={open}
          onClose={(e) => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            width={600}
            component="form"
            bgcolor={"background.default"}
            color={"text.primary"}
            p={3}
            noValidate
            autoComplete="off"
          >
            <Typography
              style={{ marginBottom: "20px" }}
              variant="h4"
              textAlign="left"
            >
              Update Profile
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  required
                  type="text"
                  id="firstname"
                  name="firstname"
                  label="First Name"
                  value={firstname || ""}
                  size="small"
                  color="error"
                  margin="dense"
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  required
                  type="text"
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  value={lastname || ""}
                  size="small"
                  color="error"
                  margin="dense"
                  onChange={onInputChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  type="text"
                  id="middlename"
                  name="middlename"
                  label="Middle Name"
                  value={middlename || ""}
                  size="small"
                  color="error"
                  margin="dense"
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  required
                  type="email"
                  id="email"
                  name="email"
                  label="Email"
                  value={email || ""}
                  size="small"
                  color="error"
                  margin="dense"
                  onChange={onInputChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  required
                  type="text"
                  id="username"
                  name="username"
                  label="Username"
                  value={username || ""}
                  size="small"
                  color="error"
                  margin="dense"
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  required
                  type="password"
                  id="password"
                  name="password"
                  label="Password"
                  value={password || ""}
                  size="small"
                  color="error"
                  margin="dense"
                  onChange={onInputChange}
                />
              </Grid>
            </Grid>

            <TextField
              sx={{ width: "100%", marginBottom: { xs: "10px", md: "20px" } }}
              type="tel"
              id="phone_no"
              name="phone_no"
              label="Phone Number"
              value={phone_no || ""}
              size="small"
              color="success"
              margin="dense"
              onChange={onInputChange}
            />
            <ButtonGroup
              fullWidth
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button onClick={handleUpdateSubmit}>Update Profile</Button>
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
        <SytledModal
          open={open2}
          onClose={(e) => setOpen2(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            width={600}
            component="form"
            bgcolor={"background.default"}
            color={"text.primary"}
            p={3}
            noValidate
            autoComplete="off"
          >
            <Typography
              style={{ marginBottom: "20px" }}
              variant="h4"
              textAlign="left"
            >
              Change Password
            </Typography>

            <TextField
              sx={{ width: "100%" }}
              required
              type="password"
              id="fpassword"
              name="fpassword"
              label="New Password"
              value={fpassword || ""}
              size="small"
              margin="dense"
              onChange={onInputChangePassword}
            />

            <TextField
              sx={{ width: "100%" }}
              required
              type="password"
              id="cpassword"
              name="cpassword"
              label="Confirm Password"
              value={cpassword || ""}
              size="small"
              margin="dense"
              onChange={onInputChangePassword}
            />
            <ButtonGroup
              fullWidth
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button onClick={handleChangePassword}>Change Password</Button>
              <Button
                color="error"
                sx={{ width: "100px" }}
                onClick={() => setOpen2(false)}
              >
                <CloseIcon />
              </Button>
            </ButtonGroup>
          </Box>
        </SytledModal>
      </Wrapper>
    </Box>
  );
};

export default Profile;
