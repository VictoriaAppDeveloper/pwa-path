import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'modal',
    initialState: {
        open: false,
    },
    reducers: {
        open: state => {
            state.open = true;
        },
        close: state => {
            state.open = false;
        },
    },
});

export const { open, close } = slice.actions;

export const opened = (state : any) => state.modal.open;

export default slice.reducer;
