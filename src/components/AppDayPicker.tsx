import DayPicker, {DateUtils} from "react-day-picker";
import {useEffect, useState} from 'react';
import 'react-day-picker/lib/style.css';
import {getAllDaysInMonth} from '../utils'


function AppDayPicker (props: {selectedDays : Array<Date>, onchange: (selectedDays : Array<Date>) => void}) {
    const [selectedDays, setSelectedDays] = useState(props.selectedDays as Array<Date>)

    const handleDayClick = (day: Date) => {
        let result : Array<Date> = [];

        if (!!selectedDays) {
            result = selectedDays.concat();
            const selectedIndex = result.findIndex((selectedDay: Date) => DateUtils.isSameDay(selectedDay, day));
            (selectedIndex >= 0) ? result.splice(selectedIndex, 1) : result.push(day)
        } else {
            result.push(day)
        }
        setSelectedDays(result)
    }

    const selectAllDaysInMonth: () => void = () => {
        let days : Array<Date | any> = getAllDaysInMonth()
        days = days.map(date => new Date(date)).filter(date => date.getDay() !== 0)
        setSelectedDays(days)
    }


    useEffect(() => {
        if (typeof props.selectedDays === 'undefined') {
            selectAllDaysInMonth()
        } else {
            if (props.selectedDays.length > 0) {
                setSelectedDays(props.selectedDays)
            }
        }
    }, [props.selectedDays])



    useEffect(() => {
        if (!!selectedDays) {
            props.onchange(selectedDays)
        }
    }, [selectedDays])

    return (
        <DayPicker
            selectedDays={selectedDays}
            onDayClick={handleDayClick}
        />
    )
}

export default AppDayPicker
