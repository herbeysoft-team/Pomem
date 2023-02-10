import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { TablePagination } from "@mui/material";
import MemoCardMine from "./MemoCardMine";

const MemoCardsMine = ({ memos }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  if (!memos.length) {
    return null;
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Box sx={{ mx: 2, mb: 10, justifyContent: "center", alignItems: "center" }}>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {memos
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((memo, index) => {
            return (
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <MemoCardMine key={memo.id * 13} memo={memo} />
              </Grid>
            );
          })}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "15px",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[12, 24, 100]}
          component="div"
          count={memos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default MemoCardsMine;
