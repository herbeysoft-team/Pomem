import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const createComment = createAsyncThunk(
    "comment/createComment",
    async ({ formValue, toast }, { rejectWithValue }) => {
      try {
        console.log(formValue)
        const response = await api.createComment(formValue);
        toast.success("Comment Added Successfully");  
        return response.data;
      } catch (err) {
        toast.error(err.response.data);
        return rejectWithValue(err.response.data);
  
      }
    }
  );

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comment: {},
    commnets: [],
    error: "",
    loading: false,
  },
  extraReducers: {
    
  }
});


export default commentSlice.reducer;