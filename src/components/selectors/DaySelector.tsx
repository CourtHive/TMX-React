// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Select, MenuItem } from '@material-ui/core';
// import { useStyles } from './style';

export const DaySelector = (props) => {
    return null;
    /*
    const { onChange } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectedDay = useSelector(state => state.tmx.select.schedule.day);

    const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
    const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

    const start = tournamentRecord.startDate;
    const end = tournamentRecord.endDate;
    const { days, closestDayOption, selectedDayInvalid } = dayOptions({start, end, selectedDay});
    const targetDay = selectedDay === '-' || selectedDayInvalid ? closestDayOption.value : selectedDay;
    useEffect(() => {
        if (selectedDayInvalid) { dispatch({type: 'schedule day', payload: targetDay }); }
    }, [targetDay, selectedDayInvalid, dispatch]);
    const scheduleDay = event => {
        dispatch({type: 'schedule day', payload: event.target.value});
        setTimeout(() => { if (onChange) onChange(); }, 200);
    }
    return (
        <Select
            variant='outlined'
            className={classes.select}
            value={targetDay}
            onChange={scheduleDay}
        >
            {days.map(t => <MenuItem key={t.value} value={t.value}>{t.text}</MenuItem>)}
        </Select>
    )
    */
};
