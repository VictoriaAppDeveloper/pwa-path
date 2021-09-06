
function AppTableBody (props : { "row-slots":  JSX.Element[]; }) {

    return (
        <tbody>
            {props["row-slots"]}
        </tbody>
    )
}

export default AppTableBody

