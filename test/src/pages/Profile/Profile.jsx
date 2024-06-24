import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import { fetchAuthMe, updateProfile } from "../../redux/slices/auth.js";
import { useDispatch } from "react-redux";
import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel, TextField, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload.js";
import { VisuallyHiddenInput } from "@chakra-ui/react";
import Alert from "@mui/material/Alert";

export const Profile = () => {
	const dispatch = useDispatch();
	const [dataUser, setDataUser] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [error, setError] = useState(null);
	const [access, setAccess] = useState(null);
	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setProfilePicture(file);
		}
	};

	const handleUpdateProfile = async () => {
		const formData = new FormData();
		formData.append("name", dataUser.name);
		formData.append("oldPassword", oldPassword);
		formData.append("newPassword", newPassword);
		if (profilePicture) {
			formData.append("profilePicture", profilePicture);
		}

		try {
			const response = await dispatch(updateProfile(formData));
			if (response.payload.message) {
				setError(response.payload.message);
			} if(response.payload.access) {
				setError(null);
				setAccess(response.payload.access);
				fetchData();
			}
		} catch (error) {
			console.error("Ошибка обновления профиля:", error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await dispatch(fetchAuthMe());
				setDataUser(response.payload);
			} catch (error) {
				console.error("Error fetching auth data:", error);
			}
		};

		fetchData();
	}, [dispatch]);

	if (!dataUser) {
		return <div>Loading...</div>;
	}

	return (
		<>


		<div style={{ background: "whitesmoke", width: '25em', height: '40%', borderRadius: '15px', marginLeft: '5em' }}>
			{error && (
				<Alert severity="error">{error}</Alert>
			)}
			{access && (
				<Alert severity="success">{access}</Alert>
			)}
			<Avatar
				alt="avatarka"
				src={`data:image/jpeg;base64,${dataUser.profilePhoto}`}
				sx={{ width: 150, height: 150, display: 'inline-block', marginTop: '1em' }}
			/>
			<div>
				<h3 style={{ color: "black" }}>{dataUser.name}</h3>
			</div>
			<div>
				<FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
					<TextField
						required
						id="outlined-required"
						label="Имя"
						defaultValue={dataUser.name}
						onChange={(e) => setDataUser({ ...dataUser, name: e.target.value })}
					/>
				</FormControl>
				<FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
					<InputLabel htmlFor="filled-adornment-password">Старый пароль</InputLabel>
					<FilledInput
						id="filled-adornment-password"
						type={showPassword ? 'text' : 'password'}
						value={oldPassword}
						onChange={(e) => setOldPassword(e.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				<FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
					<InputLabel htmlFor="filled-adornment-password">Новый пароль</InputLabel>
					<FilledInput
						id="filled-adornment-password"
						type={showPassword ? 'text' : 'password'}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				<div style={{width: "380px"}}>
					<div style={{ marginBottom: '1em', marginTop: '1em', marginLeft: '1em' }}>
						<Button
							component="label"
							variant="contained"
							startIcon={<CloudUploadIcon />}
							style={{ background: '#3873ca' }}
						>
							Выбрать аватарку
							<VisuallyHiddenInput
								type="file"
								accept="image/*"
								onChange={handleFileChange}
							/>
						</Button>
					</div>
				</div>
				<Button
					variant="contained"
					color="primary"
					onClick={handleUpdateProfile}
					style={{ marginTop: '1em' }}
				>
					Изменить
				</Button>
			</div>
		</div>
		</>
	);
}
