import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  Stack,
  IconButton,
  Modal,
  TextField,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  getCategories,
  updateCategory,
  deleteCategory,
  createCategory,
} from "../../Context/features/categorySlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
import loaderImg from "../../assets/loader.gif";

const Wrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(1),
  top: 0,
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(2),
  },
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "background.primary",
  color: "color.primary",
}));

const ContainerTable = styled(TableContainer)(({ theme }) => ({
  maxWidth: "100%",
}));
const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const initialState = {
  cat_name: "",
};
const Category = () => {
  const [formValue, setFormValue] = useState(initialState);
  const { categories, loading, error } = useSelector((state) => ({
    ...state.category,
  }));
  const { cat_name } = formValue;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [catId, setCatId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
    if (cat_name) {
      dispatch(createCategory({ formValue, navigate, toast }));
      setTimeout(() => {
        setOpen(false);
        dispatch(getCategories());
      }, 500);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (cat_name) {
      if (catId) {
        dispatch(
          updateCategory({
            catId,
            updatedValue: {
              cat_name,
            },
            navigate,
            toast,
          })
        );
      }
    }
    setTimeout(() => {
      setOpen2(false);
      dispatch(getCategories());
    }, 500);
  };

  //function called to handle edit
  const handleEdit = (id) => {
    setOpen2(true);
    if (id) {
      // eslint-disable-next-line eqeqeq
      const catDetails = categories.find((data) => data.id == id);
      setFormValue(catDetails);
      setCatId(id);
    }
  };
  //function called to handle edit
  const handleDelete = (id) => {
    if (id) {
      setCatId(id);
      setOpenDialog(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyItems: "center",
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
        textAlign="center"
        sx={{ fontWeight: "bold" }}
      >
        Category
      </Typography>
      <Wrapper>
        <ContainerTable component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableHeaderCell>
                  <Typography variant="h6">#</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">CATEGORY NAME</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">ACTIONS</Typography>
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id + 50}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography>{index + 1}</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography>{row.cat_name}</Typography>
                    </TableCell>
                    <TableCell>
                      {/* Actions */}
                      <Stack
                        direction="row"
                        spacing={0.1}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <IconButton
                          color="error"
                          onClick={() => {
                            handleEdit(row.id);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => {
                            handleDelete(row.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={categories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ContainerTable>
        <Tooltip
          onClick={(e) => {
            setOpen(true);
          }}
          title="Create Category"
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
              style={{ marginBottom: "20px" }}
              variant="h4"
              textAlign="left"
            >
              Create Category
            </Typography>

            <TextField
              sx={{ width: "100%", marginBottom: "10px" }}
              required
              type="text"
              id="cat_name"
              name="cat_name"
              label="Category"
              value={cat_name || ""}
              size="small"
              color="error"
              margin="dense"
              onChange={onInputChange}
            />

            <ButtonGroup
              fullWidth
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button onClick={handleSubmit}>Add Category</Button>
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
              style={{ marginBottom: "20px" }}
              variant="h4"
              textAlign="left"
            >
              Update Category
            </Typography>

            <TextField
              sx={{ width: "100%", marginBottom: "10px" }}
              required
              type="text"
              id="cat_name"
              name="cat_name"
              label="Category"
              value={cat_name || ""}
              size="small"
              color="error"
              margin="dense"
              onChange={onInputChange}
            />

            <ButtonGroup
              fullWidth
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button onClick={handleUpdateSubmit}>Update Category</Button>
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
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Are you sure you want to delete this category ?
          </DialogTitle>
          <DialogActions>
            <Button
              autoFocus
              color="error"
              onClick={() => setOpenDialog(false)}
            >
              Disagree
            </Button>
            <Button
              color="success"
              onClick={() => {
                dispatch(deleteCategory({ catId, toast }));
                setTimeout(() => {
                  setOpenDialog(false);
                  dispatch(getCategories());
                }, 500);
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Wrapper>
    </Box>
  );
};

export default Category;
