import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CiMemoPad } from "react-icons/ci";
import SearchIcon from "@mui/icons-material/Search";
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
  Dialog,
  DialogTitle,
  DialogActions,
  InputBase,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  getMemos,
  deleteMemo,
  clearMemo,
  getMemosBySearch,
  getMemosByCategory,
} from "../../Context/features/memoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
import loaderImg from "../../assets/loader.gif";
import { getCategories } from "../../Context/features/categorySlice";

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

const Memos = () => {
  const { memos, loading, error } = useSelector((state) => ({ ...state.memo }));
  const { categories } = useSelector((state) => ({ ...state.category }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [memoId, setMemoId] = useState();
  const [category_id, setCategory_id] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    dispatch(getMemos());
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

  //function called to view memo
  const handleView = (id) => {
    navigate(`/a_memoview/${id}`);
  };

  //function called to handle edit
  const handleDelete = (id) => {
    if (id) {
      setMemoId(id);
      setOpenDialog(true);
    }
  };

  //function called when any input  value is changed
  const onSearchChange = (e) => {
    const searchName = e.target.value;
    if (searchName.length > 3) {
      dispatch(clearMemo());
      dispatch(
        getMemosBySearch({
          searchName: {
            searchName,
          },
        })
      );
    } else {
      dispatch(getMemos());
    }
  };

  //function called when any input  value is changed
  const onSearchCategory = (e) => {
    const searchCategory = e.target.value;
    if (searchCategory) {
      dispatch(clearMemo());
      dispatch(getMemosByCategory(searchCategory));
    } else {
      dispatch(getMemos());
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
        Memos
      </Typography>
      <Wrapper>
        <Box
          component={Paper}
          sx={{
            p: 2,
            mt: -2,
            mb: 2,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid gray",
              width: "100%",
            }}
          >
            <IconButton>
              <CiMemoPad />
            </IconButton>
            <InputBase
              sx={{ flexGrow: 1 }}
              placeholder="Search for Memo by Subject"
              name="searchName"
              onChange={onSearchChange}
              type="text"
              id="searchName"
            />
            <IconButton sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <TextField
              sx={{ width: "100%" }}
              id="category_id"
              select
              name="category_id"
              label="Search Memo By Category"
              value={category_id || ""}
              size="small"
              color="error"
              margin="dense"
              onChange={onSearchCategory}
            >
              <MenuItem>Select category</MenuItem>
              {categories.map((item, index) => (
                <MenuItem key={item.id + 100} value={item.id}>
                  {item.cat_name}
                </MenuItem>
              ))}
            </TextField>
            <IconButton sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
        <ContainerTable component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableHeaderCell>
                  <Typography variant="h6">#</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">SUBJECT</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">RAISED BY</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">CATEGORY</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">STATUS</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">DEPT</Typography>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Typography variant="h6">ACTIONS</Typography>
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memos
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
                      <Typography>{row.subject.toUpperCase()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.firstname}</Typography>
                      <Typography>{row.lastname}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.cat_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        style={{
                          backgroundColor:
                            (row.status === "Approved" && "green") ||
                            (row.status === "Pending" && "orange") ||
                            (row.status === "Rejected" && "red"),
                          padding: "3px 10px",
                          alignItems: "center",
                          borderRadius: 8,
                          color: "white",
                          display: "inline-block",
                        }}
                      >
                        {row.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.dept_name}</Typography>
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
                            handleView(row.memo_id);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => {
                            handleDelete(row.memo_id);
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
            count={memos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ContainerTable>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Are you sure you want to delete this memo ?
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
                dispatch(deleteMemo({ memoId, toast }));
                setTimeout(() => {
                  setOpenDialog(false);
                  dispatch(getMemos());
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

export default Memos;
