import { IconButton, InputBase, Paper } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import {
  getMemosBySearch,
  getMemos,
  clearMemo,
} from "../Context/features/memoSlice";
import { useDispatch } from "react-redux";
const SearchCard = () => {
  const dispatch = useDispatch();

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
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        width: 400,
        border: "1px solid #ccc",
        borderRadius: 20,
        flexGrow: 1,
      }}
    >
      <IconButton sx={{ p: "10px" }}>
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Memo"
        name="searchName"
        onChange={onSearchChange}
        type="text"
        id="searchName"
      />
      <IconButton type="submit" sx={{ p: "10px" }}>
        <NoteAltIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchCard;
