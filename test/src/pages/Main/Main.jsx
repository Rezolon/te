import {UserCard} from "../../components/CardUsers/CardUsers.jsx";
import {useEffect, useState} from "react";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import styles from '../../components/CardUsers/CardUsers.module.scss';
import axios from "../../api/axios.js";
export const Main = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		axios.get('/get/users')
			.then(response => {
				console.log(response.data);
				setUsers(response.data);
				setIsLoading(false);
			})
			.catch(err => {
				setError(err);
				setIsLoading(false);
			});
	}, []);

	if (isLoading) {
		return (
			<div className={styles.skeletonContainer}>
				{Array.from(new Array(5)).map((_, index) => (
					<Card className={styles.skeletonCard} key={index}>
						<Skeleton variant="rectangular"  height={118} />
						<Skeleton variant="text" width={150} height={45} style={{margin: 'auto'}}/>
						<Skeleton variant="text" width={100} height={30} style={{margin: 'auto'}}/>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className={styles.container}>
			{users.map(user => (
				<UserCard
					key={user.id}
					name={user.name}
					img={user.img}
					age={user.age}

				/>
			))}
		</div>
	);
};
