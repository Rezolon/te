import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VisuallyHiddenInput } from '@chakra-ui/react';
import DatePicker from 'react-widgets/DatePicker';
import 'react-widgets/styles.css';
import { fetchAuthReg, selectIsAuth } from '../../redux/slices/auth.js';
import styles from './Registration.module.scss';
import Avatar from '@mui/material/Avatar';

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const [error, setError] = useState(null);
	const [profilePictureUrl, setProfilePictureUrl] = useState(null);
	const [checkedMen, setCheckedMen] = React.useState(false);
	const [checkedWom, setCheckedWom] = React.useState(false);

	const { register, handleSubmit, setValue, formState: { errors } } = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			birthDate: new Date(),
			gender: '',
			profilePicture: null,
		},
		mode: 'onChange',
	});

	const onSubmit = async (values) => {

		const data = new FormData();
		data.append('name', values.name);
		data.append('email', values.email);
		data.append('password', values.password);
		data.append('birthDate', values.birthDate.toISOString());
		data.append('gender', values.gender);
		if (values.profilePicture) {
			data.append('profilePicture', values.profilePicture[0]);
		}

		const response = await dispatch(fetchAuthReg(data));

		if (!response.payload) {
			setError('Не удалось зарегистрироваться');
		} else if (response.payload.message) {
			setError(response.payload.message);
		} else if (response.payload.token) {
			window.localStorage.setItem('token', response.payload.token);
		}
	};

	if (isAuth) {
		return <Navigate to='/main' />;
	}
	const handleIMGChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const url = URL.createObjectURL(file);
			console.log(url);
			setProfilePictureUrl(url);
		}
	};
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setValue('profilePicture', [file]);
		if (file) {
			const url = URL.createObjectURL(file);
			console.log(url);
		}
	};

	const handleGenderChange = (event) => {
		const gender = event.target.value;
		setCheckedMen(gender === 'Муж');
		setCheckedWom(gender === 'Жен');
		setValue('gender', gender);
	};

	return (
		<div className={styles.borber}>
			<div className={styles.con}>
				<h1 className={styles.title}>Добро пожаловать</h1>
				<p className={styles.viem}>Создание аккаунта</p>
				{error && (
					<Alert severity="error">{error}</Alert>
				)}
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<TextField
						className={styles.btn}
						id="outlined-basic-user"
						label="Имя"
						variant="outlined"
						error={Boolean(errors.name?.message)}
						helperText={errors.name?.message}
						{...register('name', { required: 'Укажите имя' })}
					/>
					<TextField
						className={styles.btn}
						id="outlined-basic-email"
						label="Email"
						variant="outlined"
						error={Boolean(errors.email?.message)}
						helperText={errors.email?.message}
						type="email"
						{...register('email', { required: 'Укажите Email' })}
					/>
					<TextField
						id="outlined-password-input"
						label="Пароль"
						type="password"
						autoComplete="current-password"
						className={styles.pass}
						error={Boolean(errors.password?.message)}
						helperText={errors.password?.message}
						{...register('password', { required: 'Укажите пароль' })}
					/>
					<DatePicker
						style={{ margin: '0 0px 5px 0', height: '40px' }}
						defaultValue={new Date()}
						valueEditFormat={{ dateStyle: 'short' }}
						valueDisplayFormat={{ dateStyle: 'medium' }}
						onChange={(value) => setValue('birthDate', value)}
					/>
					<div style={{ display: 'flex', justifyContent: 'space-around' }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={checkedMen}
									onChange={handleGenderChange}
									value="Муж"
								/>
							}
							label="Муж"
							style={{ color: 'black' }}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={checkedWom}
									onChange={handleGenderChange}
									value="Жен"
								/>
							}
							label="Жен"
							style={{ color: 'black' }}
						/>
					</div>
					<div style={{ display: 'flex', borderRadius: '15px', justifyContent: 'space-between', flexWrap: 'nowrap', flexDirection: 'row', alignItems: 'center' }}>
						<div style={{ marginBottom: '1em', marginTop: '1em', marginLeft: '1em' }}>
							<Button
								component="label"
								role={undefined}
								variant="contained"
								tabIndex={-1}
								startIcon={<CloudUploadIcon />}
								style={{ background: '#3873ca' }}
							>
								Выбрать аватарку
								<VisuallyHiddenInput
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									{...register('profilePicture')}
								/>
							</Button>
						</div>
					</div>
					<Button type="submit" variant="contained" size="large">
						Регистрация
					</Button>
					<p style={{ color: "black" }}>Уже есть аккаунт? <a style={{ marginLeft: '3px' }} href='/login'>Войти</a></p>
				</form>
			</div>
		</div>
	);
};
