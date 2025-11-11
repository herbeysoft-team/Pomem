import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { getMemos } from "../Context/features/memoSlice";
import MemoCard from "./MemoCard";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Backdrop } from "@mui/material";
import loaderImg from "../assets/loader.gif";

const MemoCards = () => {
  const dispatch = useDispatch();
  const { memos, allmemopagination, loadingallmemos } = useSelector((state) => ({ ...state.memo }));
  const [page, setPage] = useState(0);
  const rowsPerPage = 24;

  useEffect(() => {
    dispatch(getMemos({ page: page + 1, limit: rowsPerPage }));;
  }, [dispatch, page]);

  if (!memos.length) {
    return null;
  }

  const totalPages = allmemopagination?.totalPages || 1;

  // Pagination: Calculate visible page numbers (ellipsis style)
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
    <Box sx={{ mx: 2, mb: 10, justifyContent: "center", alignItems: "center" }}>
      {loadingallmemos && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingallmemos}
        >
          <img src={loaderImg} alt="Loading..." />
        </Backdrop>
      )}
      <Grid container rowSpacing={3} columnSpacing={3}>
        {memos.map((memo) => (
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <MemoCard memo={memo} key={memo.id * 1117} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        {/* Prev arrow button */}
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

        {/* Page Numbers with Ellipsis */}
        <Box display="flex" alignItems="center">
          {/* Always show first page */}
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
                <Box
                  sx={{
                    fontSize: "12px",
                    color: "#667085",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  ...
                </Box>
              )}
            </>
          )}

          {/* Middle pages */}
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

          {/* Always show last page */}
          {endPage < totalPages - 1 && (
            <>
              {endPage < totalPages - 2 && (
                <Box
                  sx={{
                    fontSize: "12px",
                    color: "#667085",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  ...
                </Box>
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

        {/* Next arrow button */}
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
    </Box>
  );
};

export default MemoCards;
