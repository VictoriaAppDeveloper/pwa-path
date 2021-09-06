import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import React, {useContext} from "react";
import {AppStateContext} from "../../AppStateProvider";
import {
    opened as modalOpened,
    close as closeModal
} from '../../store/modal';
import {useDispatch, useSelector} from "react-redux";


export const GlobalModal = () => {
    const opened = useSelector(modalOpened);
    const dispatch = useDispatch();
    const {setModalContentTemplate, modalContentTemplate } : any = useContext(AppStateContext);
    const onCloseModal = () => {
        dispatch(closeModal())
        setModalContentTemplate(<></>)
    }
    return (
        <Modal open={opened} center onClose={onCloseModal}>
            <div className="p-6">
                {modalContentTemplate}
            </div>
        </Modal>
    )
}

export default GlobalModal
