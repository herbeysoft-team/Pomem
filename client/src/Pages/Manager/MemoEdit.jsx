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
import { getMemo, updateMemo } from "../../Context/features/memoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import loaderImg from "../../assets/loader.gif";
import scrollreveal from "scrollreveal";

const EditMemo = () => {
    const editor = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { memo, loading } = useSelector((state) => state.memo);
    const { users } = useSelector((state) => state.user);
    const { categories } = useSelector((state) => state.category);

    const [formValue, setFormValue] = useState({
        toWho: "",
        throughWho: "",
        category: "",
        subject: "",
    });
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const sr = scrollreveal({
            origin: "bottom",
            distance: "80px",
            duration: 2000,
            reset: false,
        });
        sr.reveal(`.card`, { opacity: 0, interval: 100 });
    }, []);

    // Load users, categories, and memo
    useEffect(() => {
        dispatch(getUsers());
        dispatch(getCategories());
        dispatch(getMemo(id));
        const localUser = JSON.parse(localStorage.getItem("profile"));
        if (localUser?.result?.id) {
            setUserId(localUser.result.id);
            dispatch(getUser(localUser.result.id));
        }
    }, [dispatch, id]);

    // Populate fields when memo loads
    useEffect(() => {
        if (memo?.memo) {
            setFormValue({
                toWho: memo?.memo?.toWho || "",
                throughWho: memo?.memo?.throughWho || "",
                category: memo?.memo?.category_id || "",
                subject: memo?.memo?.subject || "",
            });
            setContent(memo?.memo?.content ?? "");
        }
    }, [memo]);

    useEffect(() => {
        loading && setIsLoading(loading);
    }, [loading]);

    // useEffect(() => {
    //     error && toast.error(error);
    // }, [error]);

    // Handle form input
    const onInputChange = (e) => {
        let { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    };

    // Submit updated memo
    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpenDialog(false);
      
        // Ensure the user is the memo creator
        if (memo?.memo?.raised_by !== userId) {
          toast.error("You can't edit this memo");
          return;
        }
      
        // Prevent editing approved memos
        if (memo?.memo?.status?.toLowerCase() === "approved") {
          toast.error("This memo has already been approved and cannot be edited.");
          return;
        }
      console.log(memo)
        const { toWho, throughWho, category, subject } = formValue;
      
        // Validate all fields
        if (toWho && category && subject && content) {
          dispatch(
            updateMemo({
              memoId: id,
              updatedValue: {
                fromWho: userId,
                fromDept: memo?.memo?.department_id,
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
        } else {
          toast.warn("Please fill in all required fields");
        }
      };
      

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "5rem",
                marginBottom: "5rem",
                padding: { xs: "1rem", md: "2rem" },
                width: "100%",
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
                Edit Memo
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Memo ID – {memo?.memo?.id}
            </Typography>

            <Box
                sx={{
                    width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
                    backgroundColor: "#fff",
                    padding: { xs: "1rem", md: "2rem" },
                    borderRadius: "12px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.05)",
                }}
            >
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            sx={{
                                width: "100%",
                                flex: 1,
                                // Always black text and label
                                "& .MuiInputBase-input": { color: "#888 !important" },
                                "& .MuiInputLabel-root": { color: "#888 !important" },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                                "& .MuiSvgIcon-root": { color: "#888 !important" }, // dropdown arrow
                            }}
                            select
                            fullWidth
                            id="toWho"
                            name="toWho"
                            label="To"
                            value={formValue.toWho || ""}
                            size="small"
                            margin="dense"
                            onChange={onInputChange}
                        >
                            {users?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
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
                            sx={{
                                width: "100%",
                                flex: 1,
                                // Always black text and label
                                "& .MuiInputBase-input": { color: "#888 !important" },
                                "& .MuiInputLabel-root": { color: "#888 !important" },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                                "& .MuiSvgIcon-root": { color: "#888 !important" }, // dropdown arrow
                            }}
                            select
                            fullWidth
                            id="throughWho"
                            name="throughWho"
                            label="Through"
                            value={formValue.throughWho || ""}
                            size="small"
                            margin="dense"
                            onChange={onInputChange}
                        >
                            {users?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
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
                    sx={{
                        width: "100%",
                        flex: 1,
                        // Always black text and label
                        "& .MuiInputBase-input": { color: "#888 !important" },
                        "& .MuiInputLabel-root": { color: "#888 !important" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                        "& .MuiSvgIcon-root": { color: "#888 !important" }, // dropdown arrow
                    }}
                    select
                    fullWidth
                    id="category"
                    name="category"
                    label="Category"
                    value={formValue.category || ""}
                    size="small"
                    margin="dense"
                    onChange={onInputChange}
                >
                    {categories?.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.cat_name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    sx={{
                        width: "100%",
                        flex: 1,
                        // Always black text and label
                        "& .MuiInputBase-input": { color: "#888 !important" },
                        "& .MuiInputLabel-root": { color: "#888 !important" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888 !important" },
                        "& .MuiSvgIcon-root": { color: "#888 !important" }, // dropdown arrow
                    }}
                    fullWidth
                    id="subject"
                    name="subject"
                    label="Subject of the Memo"
                    multiline
                    rows={2}
                    size="small"
                    margin="dense"
                    value={formValue.subject || ""}
                    onChange={onInputChange}
                />

                <Box sx={{ width: "100%" }}>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        tabIndex={1}
                        onBlur={(newContent) => setContent(newContent)}
                        onChange={() => { }}
                    />
                </Box>
            </Box>

            <Button
                onClick={() => setOpenDialog(true)}
                variant="contained"
                width="auto"
                sx={{ bgcolor: red[500], mt: 3 }}
            >
                Save Changes
            </Button>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Are you sure you want to update this memo?
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus color="error" onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button color="success" onClick={handleSubmit} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditMemo;
