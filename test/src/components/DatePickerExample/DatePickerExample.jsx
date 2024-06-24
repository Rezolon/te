import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

function DatePickerExample() {
	const [selectedDate, setSelectedDate] = useState(null);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker
				label="Дата рождения"
				value={selectedDate}
				onChange={(newValue) => {
					setSelectedDate(newValue);
				}}
				renderInput={(params) => <TextField {...params} />}
			/>
		</LocalizationProvider>
	);
}

export default DatePickerExample;
