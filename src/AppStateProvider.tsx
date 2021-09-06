import React, {useState} from "react";
export const AppStateContext = React.createContext(null);

export default function AppStateProvider({ children } : {children: JSX.Element}) {
    const [modalContentTemplate, setModalContentTemplate] = useState(<></>);

    const state = {
        modalContentTemplate: modalContentTemplate,
        setModalContentTemplate: setModalContentTemplate,
    };


    return (
        <AppStateContext.Provider value={state as any}>
             {children}
        </AppStateContext.Provider>
    );
}
