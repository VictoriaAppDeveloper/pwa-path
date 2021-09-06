import {MouseEvent, ChangeEvent, useState, useEffect} from 'react';
import {  setMany, getMany } from 'idb-keyval';
import AppDayPicker from "./AppDayPicker";


function AppForm (props: {onSubmit: () => void}) {
    const [errors, setErrors] = useState([] as Array<string>)
    const [selectedDays, setSelectedDays] = useState([] );
    const [mileage, setMileage] = useState(0 );
    const [mileagePerMonth, setMileagePerMonth] = useState(0  );
    const [consumption, setConsumption] = useState(0  );
    const [tankRemaining, setTankRemaining] = useState(0 );
    const [emittedFuel, setEmittedFuel] = useState(0 );

    const fields : {[key: string]: number} = {mileage, mileagePerMonth, consumption, tankRemaining, emittedFuel}


    const isValid : () => boolean = () => {
        const fieldNames : Array<string> = Object.keys(fields)
        return fieldNames.every(fieldName => fields[fieldName] > 0)
    }

    const writeErrors : () => void = () => {
        const fieldNames : Array<string> = Object.keys(fields)
        const errorFields : Array<string> = []
        fieldNames.forEach(fieldName => {
            if (!fields[fieldName] || fields[fieldName] <= 0) {
                errorFields.push(fieldName)
            }
        })
        setErrors(errorFields)
    }
    const handleSubmit : any = (event: MouseEvent) => {
        event.preventDefault()
        if (isValid()) {

            setMany([
                ['mileage', mileage], ['mileagePerMonth', mileagePerMonth],
                ['consumption', consumption], ['tankRemaining', tankRemaining],
                ['emittedFuel', emittedFuel], ['selectedDays', selectedDays],
            ])
            props.onSubmit()
        }  else {
            writeErrors()
        }
    }
    const onChangeInput: (event: ChangeEvent<HTMLInputElement>, setter: Function) => void
        = (event: ChangeEvent<HTMLInputElement>, setter: Function) => {
        setter(event.target.value)
    }

    const handleChangeDayPicker: (selectedDays : Array<Date>) => void = (selectedDays : Array<Date> | any) => {
        setSelectedDays(selectedDays)
    }

    const init : () => void = async () => {
        let response = await getMany(['mileage', 'mileagePerMonth', 'consumption', 'tankRemaining',
            'emittedFuel', 'selectedDays'])
        response = response.filter(item => !!item)
        if (response.length > 0) {
            setMileage(response[0])
            setMileagePerMonth(response[1])
            setConsumption(response[2])
            setTankRemaining(response[3])
            setEmittedFuel(response[4])
        }
        setSelectedDays(response[5])
    }

    useEffect(() => {
        init()
    }, [])


    return (
        <form onSubmit={handleSubmit} className="lg:grid grid-cols-2 gap-6 print:hidden">
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 grid gap-2">
                <div className="field">
                    <label className="block" htmlFor="mileage">Пробег:</label>
                    <div className="lg:grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            id="mileage"
                            className="w-full"
                            value={mileage}
                            onChange={(e) => onChangeInput(e, setMileage)}
                        />
                    </div>
                    {errors.includes('mileage') && (<div className="error">Пробег не указан.</div>)}
                </div>

                <div className="field">
                    <label className="block" htmlFor="mileagePerMonth">Пробег за месяц:</label>
                    <div className="lg:grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            id="mileagePerMonth"
                            className="w-full"
                            value={mileagePerMonth}
                            onChange={(e) => onChangeInput(e, setMileagePerMonth)}
                        />
                    </div>
                    {errors.includes('mileagePerMonth') && (<div className="error">Пробег за месяц не указан.</div>)}
                </div>

                <div className="field">
                    <label className="block" htmlFor="consumption">Расход:</label>
                    <div className="lg:grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            id="consumption"
                            className="w-full"
                            value={consumption}
                            onChange={(e) => onChangeInput(e, setConsumption)}
                        />
                    </div>
                    {errors.includes('consumption') && (<div className="error">Расход не указан.</div>)}
                </div>

                <div className="field">
                    <label className="block" htmlFor="tankRemaining">Остаток в баке:</label>
                    <div className="lg:grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            className="w-full"
                            id="tankRemaining"
                            value={tankRemaining}
                            onChange={(e) => onChangeInput(e, setTankRemaining)}
                        />
                    </div>
                    {errors.includes('tankRemaining') && (<div className="error">Остаток не указан.</div>)}
                </div>

                <div className="field">
                    <label className="block" htmlFor="emittedFuel">Выделяемое топливо:</label>

                    <div className="lg:grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            id="emittedFuel"
                            className="w-full"
                            value={emittedFuel}
                            onChange={(e) => onChangeInput(e, setEmittedFuel)}
                        />
                    </div>
                    {errors.includes('emittedFuel') && (<div className="error">Выделяемое топливо не указано.</div>)}
                </div>
            </div>

            <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex justify-center">
                <AppDayPicker selectedDays={selectedDays}
                              onchange={handleChangeDayPicker}
                />
            </div>

            <div className="col-start-1 col-end-2 row-start-2 row-end-3 flex lg:block justify-center">
                <button className="w-full lg:w-auto" type="submit">Посчитать</button>
            </div>
        </form>
    )
}

export default AppForm
