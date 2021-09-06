

import IAppTableColumns from "../interfaces/IAppTableColumns";
import IAppTableColumnValues from "../interfaces/IAppTableColumnValues";
import IAppStateContext from "../interfaces/IAppStateContext";

import AppTableHead from "./AppTableHead";
import AppTableBody from "./AppTableBody";
import {getMany} from "idb-keyval";
import {useEffect, useState, useContext} from "react";
import AppTableBodyRow from "./AppTableBodyRow";
import AppTableBodyColumn from "./AppTableBodyColumn";
import {AppStateContext} from "../AppStateProvider";
import {DateUtils} from "react-day-picker";
import {useDispatch, useSelector} from 'react-redux';
import {
 open as openModal
} from '../store/modal';
import {
    tankUpArray
} from '../store/common';

import {getDayMileage, groupmonth, getMonthDaysCount, months} from '../utils'
import AppModalTemplate from "./AppModalTemplate";
import AppTableNavigation from "./AppTableNavigation";

function AppTable (props: { columns: IAppTableColumns, updated: boolean, rendered: () => void}) {
    const dispatch = useDispatch();
    const storedTankUpArray = useSelector(tankUpArray);
    const {setModalContentTemplate } : IAppStateContext = useContext(AppStateContext);
    const [selectedDays, setSelectedDays] = useState([] as Array<Date>);
    const [mileage, setMileage] = useState(0 );
    const [mileagePerMonth, setMileagePerMonth] = useState(0  );
    const [consumption, setConsumption] = useState(0  );
    const [tankRemaining, setTankRemaining] = useState(0 );
    const [emittedFuel, setEmittedFuel] = useState(0 );
    const [tankUpSumArray, setTankUpSumArray] = useState([] );
    const [currentMonth, setCurrentMonth] = useState(0 );
    const [minMonth, setMinMonth] = useState(0 );
    const [maxMonth, setMaxMonth] = useState(0 );
    const [data, setData] = useState([] as Array<IAppTableColumnValues> );

    const fetchDBData : () => void = async () => {
        let response = await getMany(['mileage', 'mileagePerMonth', 'consumption', 'tankRemaining',
            'emittedFuel', 'selectedDays'])
        response = response.filter(item => !!item)
        if (response.length > 0) {

            setMileage(response[0])
            setMileagePerMonth(response[1])
            setConsumption(response[2])
            setTankRemaining(response[3])
            setEmittedFuel(response[4])
            setSelectedDays(response[5])


        }
    }


    const init : () => void = async () => {
        fetchDBData()
    }

    const handleClickTankUpButton = (date: Date) => {
        dispatch(openModal())
        setModalContentTemplate(<AppModalTemplate date={date} emittedFuel={emittedFuel}/>)
    }

    const columnSlots = (item: IAppTableColumnValues, idx: number) => {

        return (Object.keys(item).map((itemName, key) => {
            const value: any = (item as any)[itemName]
            const column : any = props.columns.find(column => column.name === itemName)
            const tankUpArrayRow = (!!storedTankUpArray) ? storedTankUpArray.find((row: object | any) => DateUtils.isSameDay(item['date'], new Date(row.date))) : null;
            const tankUp = !!tankUpSumArray[idx] ? tankUpSumArray[idx] : 0;

            const refueled = (!!tankUpArrayRow) ? tankUpArrayRow.value  + tankUp + item['tankRemaining'] : 0;

            const slot = (
                <div className="block items-center">
                    {!!tankUpArrayRow && (
                        <span className="text-green-500">
                            +
                            {tankUpArrayRow.value}
                            = {refueled}
                        </span>
                    )}
                    <button onClick={() => {
                        handleClickTankUpButton(
                            item['date']
                        )
                    }} className="button-sm button-green opacity-0 block w-full print:hidden">
                        Заправить
                    </button>
                </div>
            )

            const valueClass = itemName === 'tankRemaining' ? (value + tankUp < 0) ? 'text-red-500' : '' : ''

            return ((typeof column.show === 'undefined' || column.show) && (<AppTableBodyColumn key={key}
                                        value={(itemName === 'tankRemaining') ? (value + tankUp) : value}
                                        valueClass={valueClass}
                                        class={'column_' + itemName}
                                        slot={itemName === 'tankRemaining' &&
                                        slot}
            />))
        }))
    }

    const rowSlots = () => (
        data.map((item, key) => {
            return (<AppTableBodyRow key={key}
                             show={currentMonth === item.date.getMonth()}
                             column-slots={columnSlots(item, key)}
            />)
        })
    )



    const prepareData : () => void = () => {
        const daysObj = groupmonth(selectedDays)

        if (Object.keys(daysObj).length > 0) {
            let totalMonthMileage: number = 0
            let totalMileage: number = 0
            let _tankRemaining: number = tankRemaining


            setData(selectedDays.map((day, key) => {
                    const daysCount = getMonthDaysCount(daysObj, day)

                    let mileagePerDay = getDayMileage(
                        daysCount,
                        Number(mileagePerMonth)
                    )
                    totalMonthMileage += mileagePerDay


                    if (key === daysCount - 1) {
                        if (totalMonthMileage > mileagePerMonth) {
                            mileagePerDay -= (totalMonthMileage - mileagePerMonth)
                        } else {
                            mileagePerDay += (mileagePerMonth - totalMonthMileage)
                        }
                    }

                    const tankRemainingPerDay = Math.ceil(mileagePerDay * (Number(consumption)/100))
                    _tankRemaining -= tankRemainingPerDay
                    totalMileage += mileagePerDay

                    const row: any = {
                        day: day.getDate(),
                        totalMileage: totalMileage + Number(mileage),
                        mileagePerDay: mileagePerDay,
                        tankRemaining: _tankRemaining,
                        date: day
                    }
                    const sortedRow: any = {}

                    props.columns.forEach(column => {
                        sortedRow[column.name] = row[column.name]
                    })

                    return sortedRow
                }
            ))
        }
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        if (props.updated) {
            fetchDBData()
        }
    }, [props.updated])


    useEffect(() => {
        prepareData()
    }, [selectedDays, mileage, mileagePerMonth, consumption, tankRemaining, emittedFuel])

    useEffect(() => {
        props.rendered()
        if (!!data[0]) {
            setCurrentMonth(data[0].date.getMonth())
            setMaxMonth(Math.max.apply(Math, data.map((item) => item.date.getMonth())))
            setMinMonth(Math.min.apply(Math, data.map((item) => item.date.getMonth())))
        }
    }, [data])

    useEffect(() => {
        let tankUpSum : number = 0
        setTankUpSumArray(selectedDays.reduce((arr, currentValue) => {
            if (!!currentValue) {
                const item = (!!storedTankUpArray) ? storedTankUpArray.find((item: object | any) => DateUtils.isSameDay(currentValue, new Date(item.date))) : null;
                const tankUp = (!!item) ? item.value : 0
                // @ts-ignore
                arr.push(tankUpSum)
                tankUpSum += tankUp
            }
            return arr

        }, []))
    }, [storedTankUpArray])

    const back = () => {
        setCurrentMonth(currentMonth - 1)
    }

    const forward = () => {
        setCurrentMonth(currentMonth + 1)
    }


    return (
        <div className="grid gap-6">
            <table className="table-fixed w-full">
                <AppTableHead columns={props.columns}/>
                <AppTableBody row-slots={rowSlots()}/>
            </table>
            <AppTableNavigation pageName={months[currentMonth]}
                                back={back}
                                forward={forward}
                                min={minMonth}
                                max={maxMonth}
                                current={currentMonth}
            />
        </div>
    )
}

export default AppTable
