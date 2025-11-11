import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const createMemo = createAsyncThunk(
  "memo/createMemo",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.createMemo(formValue);
      toast.success("Memo Created Successfully");
      navigate("/m_dashboard");
      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const memoNotification = createAsyncThunk(
  "memo/memoNotification",
  async ({ formValue, toast }, { rejectWithValue }) => {
    try {
      const response = await api.memoNotification(formValue);
      toast.success("Notification Sent");
      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMemosBySearch = createAsyncThunk(
  "memo/getMemosBySearch",
  async ({ searchName, page, limit }, { rejectWithValue }) => {
    try {
      const response = await api.getMemosBySearch(searchName, page, limit);
      return response.data;
    } catch (err) {
      //toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMemosCount = createAsyncThunk(
  "memo/getMemosCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllMemosCount();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMemos = createAsyncThunk(
  "memo/getMemos",
  async ({page, limit}, { rejectWithValue }) => {
    try {
      const response = await api.getAllMemos(page, limit);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMemosByCategory = createAsyncThunk(
  "memo/getMemosByCategory",
  async ({id, page, limit}, { rejectWithValue }) => {
    try {
      const response = await api.getAllMemosByCategory(id, page, limit);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMemosByUser = createAsyncThunk(
  "memo/getMemosByUser",
  async ({id, page, limit, search}, { rejectWithValue }) => {
    try {
      const response = await api.getAllMemosByUser(id, page, limit, search);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMemosToAttend = createAsyncThunk(
  "memo/getMemosToAttend",
  async ({id, page, limit, search}, { rejectWithValue }) => {
    try {
      const response = await api.getAllMemosToAttend(id, page, limit, search);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMemo = createAsyncThunk(
  "memo/getMemo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getMemo(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateMemo = createAsyncThunk(
  "memo/updateMemo",
  async ({ memoId, updatedValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.updateMemo(updatedValue, memoId);
      toast.success("Memo Updated Successfully");
      setTimeout(() => navigate("/m_mymemo"), 1000);
      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateMemoStatus = createAsyncThunk(
  "memo/updateMemoStatus",
  async ({ memoId, updatedValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.updateMemoStatus(updatedValue, memoId);
      toast.success(`Memo ${updatedValue.status}`);
      setTimeout(() => navigate("/m_attendto"), 1000);
      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteMemo = createAsyncThunk(
  "memo/deleteMemo",
  async ({ memoId, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteMemo(memoId);
      toast.success("Memo Deleted Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const memoSlice = createSlice({
  name: "memo",
  initialState: {
    memo: {},
    memos: [],
    memosByUser: [],
    memosToAttend: [],
    memoscount: {},
    allmemopagination:{
      currentPage: 1,
      totalPages: 1,
      totalMemos: 0,
      limit: 24,
    },
    mymemopagination:{
      currentPage: 1,
      totalPages: 1,
      totalMemos: 0,
      limit: 24,
    },
    attendmemopagination:{
      currentPage: 1,
      totalPages: 1,
      totalMemos: 0,
      limit: 24,
    },
    error: "",
    loadingallmemos: false,
    loadingmymemo: false,
    loadingattendmemo: false,
  },
  reducers: {
    clearMemo: (state) => {
      state.memos = [];
    },
  },
  extraReducers: {
    [getMemos.pending]: (state, action) => {
      state.loadingallmemos = true;
    },
    [getMemos.fulfilled]: (state, action) => {
      state.loadingallmemos = false;
      state.memos = action.payload.memos;
      state.allmemopagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalMemos: action.payload.totalMemos,
        limit: action.payload.limit,
      };
    },
    [getMemos.rejected]: (state, action) => {
      state.loadingallmemos = false;
      state.error = action.payload.message;
    },
    [getMemosBySearch.rejected]: (state, action) => {
      state.loadingallmemos = false;
      state.error = action.payload.message;
    },
    [getMemosBySearch.pending]: (state, action) => {
      state.loading = true;
    },
    [getMemosBySearch.fulfilled]: (state, action) => {
      state.loading = false;
      state.memos = action.payload.memos;
      state.allmemopagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalMemos: action.payload.totalMemos,
        limit: action.payload.limit,
      };
    },
    [getMemosCount.pending]: (state, action) => {
      state.loading = true;
    },
    [getMemosCount.fulfilled]: (state, action) => {
      state.loading = false;
      state.memoscount = action.payload;
    },
    [getMemosCount.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getMemosByCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [getMemosByCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.memos = action.payload.memos;
      state.allmemopagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalMemos: action.payload.totalMemos,
        limit: action.payload.limit,
      };
    },
    [getMemosByCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getMemosByUser.rejected]: (state, action) => {
      state.loadingmymemo = false;
      state.error = action.payload.message;
    },
    [getMemosByUser.pending]: (state, action) => {
      state.loadingmymemo = true;
    },
    [getMemosByUser.fulfilled]: (state, action) => {
      state.loadingmymemo = false;
      state.memosByUser = action.payload.memos;
      state.mymemopagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalMemos: action.payload.totalMemos,
        limit: action.payload.limit,
      };
    },
    [getMemosToAttend.rejected]: (state, action) => {
      state.loadingattendmemo = false;
      state.error = action.payload.message;
    },
    [getMemosToAttend.pending]: (state, action) => {
      state.loadingattendmemo = true;
    },
    [getMemosToAttend.fulfilled]: (state, action) => {
      state.loadingattendmemo = false;
      state.memosToAttend = action.payload.memos;
      state.attendmemopagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalMemos: action.payload.totalMemos,
        limit: action.payload.limit,
      };
    },
    [deleteMemo.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteMemo.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.memos = state.memos.filter((item) => item.id !== id);
      }
    },
    [deleteMemo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getMemo.pending]: (state, action) => {
      state.loading = true;
    },
    [getMemo.fulfilled]: (state, action) => {
      state.loading = false;
      state.memo = action.payload;
    },
    [getMemo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updateMemo.pending]: (state, action) => {
      state.loading = true;
    },
    [updateMemo.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.memos = state.memos.map((item) =>
          item.id === id ? action.payload : item
        );
      }
    },
    [updateMemo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updateMemoStatus.pending]: (state, action) => {
      state.loading = true;
    },
    [updateMemoStatus.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.memosByUser = state.memosByUser.map((item) =>
          item.id === id ? action.payload : item
        );
      }
    },
    [updateMemo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { clearMemo } = memoSlice.actions;
export default memoSlice.reducer;
