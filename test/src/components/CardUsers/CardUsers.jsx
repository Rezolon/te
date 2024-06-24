import * as React from 'react';
import Card from '@mui/material/Card';
import {useNavigate} from "react-router-dom";
import {CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import styles from './CardUsers.module.scss';


export const UserCard = ({ name, img, age }) => {
	const profilePhotoSrc = img ? `data:image/jpeg;base64,${img}` : null;

	return (
			<Card className={styles.card}>
				<CardMedia
					component="img"
					height="140"
					image={profilePhotoSrc}
					alt={name}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Имя: {name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Возраст: {age} лет
					</Typography>
				</CardContent>
			</Card>
	);
};
