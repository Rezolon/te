import React from "react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Card from '@mui/material/Card';
import styles from "./CardUsers.module.scss";

export const skeletonCard = () => {
	return (
		<Card className={styles.margin} sx={{ width: 320 }}>
			<Stack className={styles.SkeletonTitle} spacing={2}>
				<Stack direction="row" className={styles.per} spacing={1}>
					<Skeleton variant="text" width="20%" height={35} animation="wave" />
					<Skeleton variant="text" width="30%" height={35} animation="wave" />
				</Stack>
				<Skeleton variant="rectangular" width="60%"  height={50} animation="wave" />

				<Skeleton variant="text" width="45%" height={24} animation="wave" />
				<Skeleton variant="text" width="45%" height={24} animation="wave" />
				<Skeleton variant="text" width="45%" height={24} animation="wave" />

				<Skeleton variant="text" width="40%" height={5} animation="wave" />
				<Skeleton variant="rectangular" width="85%"  height={50} animation="wave"/>
				{/*<Stack direction="row" spacing={1}>*/}
				{/*    <Skeleton variant="text" width="45%" height={20} animation="wave" />*/}
				{/*    <Skeleton variant="text" width="45%" height={20} animation="wave" />*/}
				{/*</Stack>*/}

				{/*<Skeleton variant="text" width="40%" height={16} animation="wave" />*/}

				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Skeleton variant="text" width="30%" height={24} animation="wave" />

				</Stack>
			</Stack>
		</Card>
	);
};