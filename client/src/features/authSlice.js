import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/auth";

// Load from localStorage
const tokenFromStorage = localStorage.getItem("token") || null;
const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/login`, data);
      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/register`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

// UPDATE USER (name + profileImage)
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("token");
      if (!token) return rejectWithValue({ error: "Not authenticated" });

      const res = await axios.post(`${API}/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || "Login failed";
    });

    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || "Registration failed";
    });

    // UPDATE USER
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // update user in redux
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || "Update failed";
    });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
