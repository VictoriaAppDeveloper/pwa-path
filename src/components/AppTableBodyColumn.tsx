export default (props: {
    value: Number,
    slot: JSX.Element | false,
    class: string,
    valueClass: string,
}) => (
    <td className={props.class + ' border border-gray-900 text-gray-900 font-medium ' +
    'h-16 print:text-left print:p-0 print:h-auto'}>
        <span className={props.valueClass}>{props.value}</span>
        {props.slot}
    </td>
)
