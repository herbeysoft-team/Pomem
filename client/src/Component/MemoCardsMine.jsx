import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import MemoCardMine from "./MemoCardMine";
import { getMemosByUser } from "../Context/features/memoSlice";
import loaderImg from "../assets/loader.gif";
import { ArrowBack, ArrowForward, Inbox } from "@mui/icons-material";
import { IconButton, Backdrop, Button, Typography } from "@mui/material";

const MemoCardsMine = ({ search }) => {
  const dispatch = useDispatch();
  const { memosByUser, mymemopagination, loadingmymemo } = useSelector((state) => ({
    ...state.memo,
  }));
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState(null);
  const rowsPerPage = 24;

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("profile"));
    setUserId(user?.result?.id);
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(getMemosByUser({ id: userId, page: page + 1, limit: rowsPerPage, search: search || "" }));
    }
  }, [dispatch, userId, page, search]);

  const memoizedMyMemo = useMemo(() => memosByUser, [memosByUser]);

  const totalPages = mymemopagination?.totalPages || 1;

  const maxPagesToShow = 2;
  const pageNumbers = [];
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ mx: 2, mb: 5, justifyContent: "center", alignItems: "center" }}>
      {loadingmymemo && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingmymemo}>
          <img src={loaderImg} alt="Loading..." />
        </Backdrop>
      )}

      {/* ✅ Empty State when no memo */}
      {!loadingmymemo && (!memoizedMyMemo || memoizedMyMemo.length === 0) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            color: "text.secondary",
          }}
        >
          <Inbox sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#555" }}>
            You don’t have any memo yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 1 }}>
            When you create a memo, it will appear here.
          </Typography>
        </Box>
      )}

      {/* ✅ Render memos only when available */}
      {memoizedMyMemo && memoizedMyMemo.length > 0 && (
        <>
          <Grid container rowSpacing={3} columnSpacing={3}>
            {memoizedMyMemo.map((memo) => (
              <Grid key={memo.id} item xs={12} sm={6} md={6} lg={4}>
                <MemoCardMine memo={memo} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              gap: "10px",
            }}
          >
            {/* Prev */}
            <IconButton
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              sx={{
                border: "1px solid #344054",
                borderRadius: "50%",
                width: 40,
                height: 40,
              }}
            >
              <ArrowBack sx={{ color: page === 0 ? "#ccc" : "#344054" }} />
            </IconButton>

            {/* Page numbers */}
            <Box display="flex" alignItems="center">
              {startPage > 0 && (
                <>
                  <Button
                    onClick={() => handleChangePage(0)}
                    sx={{
                      color: page === 0 ? "#1D2939" : "#667085",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    1
                  </Button>
                  {startPage > 1 && (
                    <Box sx={{ fontSize: "12px", color: "#667085", fontFamily: "Outfit, sans-serif" }}>...</Box>
                  )}
                </>
              )}
              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => handleChangePage(pageNumber)}
                  sx={{
                    color: page === pageNumber ? "#1D2939" : "#667085",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "12px",
                    fontWeight: page === pageNumber ? "bold" : "normal",
                  }}
                >
                  {pageNumber + 1}
                </Button>
              ))}
              {endPage < totalPages - 1 && (
                <>
                  {endPage < totalPages - 2 && (
                    <Box sx={{ fontSize: "12px", color: "#667085", fontFamily: "Outfit, sans-serif" }}>...</Box>
                  )}
                  <Button
                    onClick={() => handleChangePage(totalPages - 1)}
                    sx={{
                      color: page === totalPages - 1 ? "#1D2939" : "#667085",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </Box>

            {/* Next */}
            <IconButton
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              sx={{
                border: "1px solid #344054",
                borderRadius: "50%",
                width: 40,
                height: 40,
              }}
            >
              <ArrowForward sx={{ color: page >= totalPages - 1 ? "#ccc" : "#344054" }} />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MemoCardsMine;
