import {DateUtils} from "react-day-picker";


export function groupmonth(dates: Array<any>){

    return dates
        .sort((prev, next) => prev.getTime() - next.getTime()) //сортировка от меньшего к большему
        .reduce( (tally, date) => {
            let month = date.toLocaleString('default', { month: 'short' }) ;
            const year = date.getFullYear();
            tally[month + ', ' + year] = dates
                .filter(item => item.toLocaleString('default', { month: 'short' }) === month); //создание массива из дат, входящих в определенный месяц
            return tally;
        } , {}) //группировать по месяцам
}

export function getMonthDaysCount(dateObj : {string : Date[]} | any, day : Date) {
    for (let i of Object.keys(dateObj)) {
        const item : Date[] = dateObj[i]
        for (let j of item) {
            if (DateUtils.isSameDay(j, day)) {
                return item.length
            }

        }
    }
    return 0
}

export const months = ['январь', 'февраль', 'март', 'апрель','май', 'июнь', 'июль', 'август','сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

export function getDayMileage(datesCount: number, mileagePerMonth: number) {
    let base = mileagePerMonth/datesCount


    let min = base - (base * (getRandomInt(15, 20)/100)),
        max = base + (base * (getRandomInt(15, 20)/100));
    return (datesCount > 1) ? getRandomInt(min, max) : base
}

const getRandomInt = (min: number, max: number) => Math.round(Math.floor(Math.random() * (max - min)) + min)

export function getAllDaysInMonth(){
    let date = new Date();
    let month = date.getMonth();
    date.setDate(1);
    let allDays = [];
    while (date.getMonth() === month) {
        var d = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
        allDays.push(d);
        date.setDate(date.getDate() + 1);
    }
    return allDays
}
