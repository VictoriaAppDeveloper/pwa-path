import IAppTableColumns from "../interfaces/IAppTableColumns";


function AppTableHead (
    props: {
        columns: IAppTableColumns
    }) {
    return (
        <thead>
        <tr>
            {props.columns.map((column, key) => ((typeof column.show === 'undefined' || column.show) && (
                <th
                    className="px-4 py-2 text-gray-900 print:text-left print:p-0"
                    key={key}>
                    {column.title}
                </th>)
            ))}
        </tr>
        </thead>
    )
}

export default AppTableHead
