import { createSlice } from '@reduxjs/toolkit';

const initialState : {tankUpArray: Array<object>} = {
    tankUpArray: []
}

export const slice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        tankUpArrayInsert: (state, action )  => {
            state.tankUpArray.push(action.payload)
        },
        tankUpArrayRemove: (state, action )  => {
            state.tankUpArray.splice(action.payload, 1)
        },
        tankUpArrayUpdate: (state, action) => {
            const rowId = action.payload.rowId
            const value =  action.payload.value
            state.tankUpArray = state.tankUpArray.map((item, idx) => (
                idx===rowId? {...item, value: value}: item
            ))
        }
    },
});

export const { tankUpArrayInsert, tankUpArrayRemove, tankUpArrayUpdate } = slice.actions;

export const tankUpArray = (state : any) => state.common.tankUpArray;

export default slice.reducer;
