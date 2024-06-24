import styles from '../Registration/Registration.module.scss'
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import {TextField} from "@mui/material";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector} from "react-redux";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth.js";

export const Login = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();

	const { register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
		defaultValues: {
			email: '',
			password: ''
		},
		mode: 'onChange',
	});

	const onSubmit =  async (values) =>{
		const data = await dispatch(fetchAuth(values));

		if(!data.payload){
			alert('Неверный email или пароль');
		}


		if('token' in data.payload){
			window.localStorage.setItem('token', data.payload.token);
		}

	};

	console.log(isAuth);

	if(isAuth){
		return <Navigate to='/main'/>;
	}
	return (
		<div className={styles.main}>
			<div className={styles.con}>
				<h1 className={styles.title}>Добро пожаловать</h1>
				<p className={styles.viem}>Войдите в свою учетную запись</p>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<TextField
						className={styles.btn}
						id="outlined-basic"
						label="Почта"
						variant="outlined"
						error={Boolean(errors.email?.message)}
						helperText={errors.email?.message}
						type ="email"
						{...register('email', {required: 'Укажите почту'})}
					/>
					<TextField
						id="outlined-password-input"
						label="Пароль"
						type="password"
						autoComplete="current-password"
						className={styles.pass}
						error={Boolean(errors.email?.message)}
						helperText={errors.password?.message}
						{...register('password', {required: 'Укажите пароль'})}
					/>
					<Button type='submit' variant="contained" size="large">
						Вход
					</Button>
				</form>
			</div>
		</div>
	);
}