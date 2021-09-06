import {ChangeEvent, MouseEvent, useContext, useState} from "react";
import {AppStateContext} from "../AppStateProvider";
import {DateUtils} from "react-day-picker";
import IAppTankUpArray from "../interfaces/IAppTankUpArray";
import IAppStateContext from "../interfaces/IAppStateContext";
import {useDispatch, useSelector} from 'react-redux';
import {
    close as closeModal,
} from '../store/modal';
import {
    tankUpArrayInsert,
    tankUpArrayRemove,
    tankUpArrayUpdate,
    tankUpArray
} from '../store/common';


const AppModalTemplate = (props: {date : Date, emittedFuel: number}) => {
    const dispatch = useDispatch();
    const storedTankUpArray = useSelector(tankUpArray);
    const {setModalContentTemplate } : IAppStateContext = useContext(AppStateContext);
    const [tankUp, setTankUp] = useState(0)
    const tankUpSum = (storedTankUpArray.length > 0) ?
        /* @ts-ignore */
        storedTankUpArray.map(item => item.value).reduce((prev, next) => prev + next) : 0;
    const fuelRemaining = props.emittedFuel - tankUpSum;





    const handleSubmit : any = (event: MouseEvent) => {
        event.preventDefault()
        if (Number(tankUp) <= fuelRemaining) {
            const _tankUpArray: IAppTankUpArray = storedTankUpArray
            let row = _tankUpArray.find(row => DateUtils.isSameDay(props.date, new Date(row.date)))
            let rowId = _tankUpArray.findIndex(row => DateUtils.isSameDay(props.date, new Date(row.date)))

            if (!!row) {
                if (Number(tankUp) > 0) {
                    dispatch(tankUpArrayUpdate({rowId: rowId, value: Number(tankUp)}))
                } else {
                    dispatch(tankUpArrayRemove(_tankUpArray.indexOf(row)))
                }
            } else {
                if (Number(tankUp) > 0) {
                    dispatch(tankUpArrayInsert({
                        date: props.date.toString(),
                        value: Number(tankUp)
                    }))
                }
            }
        }
        dispatch(closeModal())
        setModalContentTemplate(<></>)
    }

    const onChangeInput: (event: ChangeEvent<HTMLInputElement>, setter: Function) => void
        = (event: ChangeEvent<HTMLInputElement>, setter: Function) => {
        setter(event.target.value)
    }

    return (
        <form className="grid gap-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="tankUp" className="block">Заправили:</label>
                <input
                    type="number"
                    id="tankUp"
                    value={tankUp}
                    onChange={(e) => onChangeInput(e, setTankUp)}
                />
            </div>
            <span>доступно {fuelRemaining > 0 ? fuelRemaining : 0} литров</span>
            <button type="submit">Сохранить</button>
        </form>
    )
}

export default AppModalTemplate
