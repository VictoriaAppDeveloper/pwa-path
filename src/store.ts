import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './store/modal';
import commonReducer from './store/common';

export default configureStore({
    reducer: {
        modal: modalReducer,
        common: commonReducer,
    },
});
