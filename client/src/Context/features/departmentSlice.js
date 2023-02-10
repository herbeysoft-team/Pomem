import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const createDepartment = createAsyncThunk(
    "department/createDepartment",
    async ({ formValue, navigate, toast }, { rejectWithValue }) => {
      try {
        const response = await api.createDepartment(formValue);
        toast.success("Department Created Successfully");
        navigate("/a_department");
        return response.data;
      } catch (err) {
        toast.error(err.response.data);
        return rejectWithValue(err.response.data);
  
      }
    }
  );

export const getDepartments = createAsyncThunk(
  "department/getDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllDepartments();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getDepartment = createAsyncThunk(
  "department/getDepartment",
  async (id, { rejectWithValue }) => {
    try {
      
      const response = await api.getDepartment(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async ({ deptId, updatedValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.updateDepartment(updatedValue, deptId);
      toast.success("Department Updated Successfully");
      setTimeout(()=> navigate("/a_department"), 1000);
      return response.data;
    } catch (err) {
      toast.error(err.response.data);
      return rejectWithValue(err.response.data);

    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async ({ deptId, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteDepartment(deptId);
      toast.success("Department Deleted Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    department: {},
    departments: [],
    error: "",
    loading: false,
  },
  extraReducers: {
    [getDepartments.pending]: (state, action) => {
      state.loading = true;
    },
    [getDepartments.fulfilled]: (state, action) => {
      state.loading = false;
      state.departments = action.payload;
    },
    [getDepartments.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [deleteDepartment.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteDepartment.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.departments = state.departments.filter((item) => item.id !== id);
      }
    },
    [deleteDepartment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getDepartment.pending]: (state, action) => {
      state.loading = true;
    },
    [getDepartment.fulfilled]: (state, action) => {
      state.loading = false;
      state.department = action.payload;
    },
    [getDepartment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updateDepartment.pending]: (state, action) => {
      state.loading = true;
    },
    [updateDepartment.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.departments = state.departments.map((item) => item.id === id ? action.payload : item);
      }
    },
    [updateDepartment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  }
});


export default departmentSlice.reducer;