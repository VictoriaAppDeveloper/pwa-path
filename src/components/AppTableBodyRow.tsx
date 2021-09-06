export default (props : { "column-slots": JSX.Element[]; "show": boolean }) => (
    <tr className={(props.show) ? '' : 'hidden'}>
        {props["column-slots"]}
    </tr>
)
