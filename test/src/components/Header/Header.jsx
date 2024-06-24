import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import {logout, selectIsAuth} from '../../redux/slices/auth.js';
import styles from './Header.module.scss';
import Avatar from "@mui/material/Avatar";

export const Header = ({dataUser}) => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const profilePhotoSrc = dataUser.profilePhoto ? `data:image/jpeg;base64,${dataUser.profilePhoto}` : null;
	const handleLogout = () => {
		dispatch(logout());
		window.localStorage.removeItem('token');
		navigate('/');
	};

	return (
		<header className={styles.header}>
			<a href="/main" style={{color: "black", fontSize: '35px'}}>MyApp</a>


			{isAuth &&
				<div style={{display: "flex", justifyContent: "space-between", width: "300px", alignItems: "center"}}>

					<a href='/account'>{dataUser.name}</a>
					<Avatar alt="Profile Picture" src={profilePhotoSrc}/>
					<Button onClick={handleLogout} variant="contained" color="secondary">
						Выйти
					</Button>
				</div>
				}
		</header>
	);
};
