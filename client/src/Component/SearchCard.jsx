import { IconButton, InputBase, Paper } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
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
      console.log(searchName)
      dispatch(
        getMemosBySearch({
          searchName: {
            searchName,
          },
          page: 1,
          limit: 24
        })
      );
    } else {
      dispatch(getMemos({ page: 1, limit: 24 }));
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
      
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Memo by Title or ID"
        name="searchName"
        onChange={onSearchChange}
        type="text"
        id="searchName"
      />
      <IconButton sx={{ p: "10px" }}>
        <SearchIcon />
      </IconButton>
      {/* <IconButton type="submit" sx={{ p: "10px" }}>
        <NoteAltIcon />
      </IconButton> */}
    </Paper>
  );
};

export default SearchCard;
