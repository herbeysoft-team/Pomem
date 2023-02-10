import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.createCategory(formValue);
      toast.success("Category Created Successfully");
      navigate("/a_category");
      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllCategories();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getCategory(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ catId, updatedValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.updateCategory(updatedValue, catId);
      toast.success("Category Updated Successfully");
      setTimeout(() => navigate("/a_category"), 1000);
      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({ deptId, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteCategory(deptId);
      toast.success("Category Deleted Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: {},
    categories: [],
    error: "",
    loading: false,
  },
  extraReducers: {
    [getCategories.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    [getCategories.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [deleteCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.categories = state.categories.filter((item) => item.id !== id);
      }
    },
    [deleteCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.department = action.payload;
    },
    [getCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updateCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.categories = state.departments.map((item) =>
          item.id === id ? action.payload : item
        );
      }
    },
    [updateCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export default categorySlice.reducer;
