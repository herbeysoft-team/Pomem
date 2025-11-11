import { Box, Typography, Paper, InputBase, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import MemoCardsMine from "../../Component/MemoCardsMine";
import scrollreveal from "scrollreveal";
import SearchIcon from "@mui/icons-material/Search";

const MyMemos = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
        marginTop: "5rem",
        marginBottom: "2rem",
        padding: { xs: "0rem", md: "2rem" },
      }}
      className="card"
    >
      <Typography
        component="h4"
        variant="h4"
        fontWeight="bold"
        marginBottom={2}
      >
        My Memos
      </Typography>
      {/* Search Box */}
      <Paper
      component="form"
      sx={{
        width: "95%",
        p: "2px 4px",
        mt: 2,
        mx: "auto",
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: 20,
        flexGrow: 1,
      }}
      onSubmit={(e) => e.preventDefault()} // prevent page reload
    >
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        placeholder="Search My Memo by Title or ID"
        name="searchName"
        value={searchQuery}
        onChange={handleSearch}
        type="text"
        id="searchName"
      />
      <IconButton type="button" sx={{ p: "10px" }}>
        <SearchIcon />
      </IconButton>
    </Paper>
      <Box sx={{ width: "100%", mt: 2 }}>
        <MemoCardsMine search={searchQuery} />
      </Box>
    </Box>
  );
};

export default MyMemos;
