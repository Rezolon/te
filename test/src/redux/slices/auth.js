import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/axios.js';

export const fetchAuthReg = createAsyncThunk('auth/fetchUserDataReg', async (params) => {
	try {
		const { data } = await axios.post('/auth/registration', params);
		return data;
	} catch (error) {
		throw error;
	}
});

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
	const { data } = await axios.post('/auth/login', params);
	return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
	const { data } = await axios.get('/auth/me');
	return data;
});
export const updateProfile = createAsyncThunk('auth/updateProfile', async (params) => {
	const response = await axios.post('/auth/updateProfile', params);
	return response.data;
});

const initialState = {
	data: null,
	status: 'loading',
	isAdmin: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null;
			state.isAdmin = false;
		}
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(fetchAuth.pending, (state) => {
				state.status = 'loading';
				state.data = null;
			})
			.addCase(fetchAuth.fulfilled, (state, action) => {
				state.status = 'loaded';
				state.data = action.payload;

			})
			.addCase(fetchAuth.rejected, (state) => {
				state.status = 'error';
				state.data = null;
			})
			.addCase(fetchAuthReg.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchAuthReg.fulfilled, (state, action) => {
				state.status = 'loaded';
				state.data = action.payload;
			})
			.addCase(fetchAuthReg.rejected, (state, action) => {
				state.status = 'error';
				state.data = action.payload;
			})
			.addCase(fetchAuthMe.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchAuthMe.fulfilled, (state, action) => {
				state.status = 'loaded';
				state.data = action.payload;
				state.isAdmin = action.payload.typeUser === 'admin';
			})
			.addCase(fetchAuthMe.rejected, (state) => {
				state.status = 'error';
				state.data = null;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.user = action.payload.user;
			});
	},
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const selectIsAdmin = (state) => state.auth.isAdmin;

export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
