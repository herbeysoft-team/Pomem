import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllUsers();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUsersCount = createAsyncThunk(
  "user/getUsersCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllUsersCount();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getUserProfile(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getUser = createAsyncThunk(
  "user/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getUser(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, updatedValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.updateUser(updatedValue, userId);
      toast.success("Updated Successfully");

      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ userId, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteUser(userId);
      toast.success("User Deleted Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    users: [],
    userscount: {},
    error: "",
    loading: false,
  },
  extraReducers: {
    [getUsers.pending]: (state, action) => {
      state.loading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getUsersCount.pending]: (state, action) => {
      state.loading = true;
    },
    [getUsersCount.fulfilled]: (state, action) => {
      state.loading = false;
      state.userscount = action.payload;
    },
    [getUsersCount.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [deleteUser.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.users = state.users.filter((item) => item.id !== id);
      }
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [getUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getUserProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [getUserProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [getUserProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updateUser.pending]: (state, action) => {
      state.loading = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.users = state.users.map((item) =>
          item.id === id ? action.payload : item
        );
      }
    },
    [updateUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export default userSlice.reducer;
