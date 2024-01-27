import { createSlice } from "@reduxjs/toolkit";
import { MatrixType } from "../types/types";

// state

type InitialState = {
    matrix: MatrixType;
    playerPosition: number[];
};

const name = "app";
const initialState = {
    matrix: [],
    playerPosition: [0, 0],
} as InitialState;

const slice = createSlice({
    name,
    initialState,
    reducers: {
        setMatrix: (state, action) => {
            state.matrix = action.payload;
        },
        setPlayerPosition: (state, action) => {
            state.playerPosition = action.payload;
        },
    },
});

// exports

export const appActions = { ...slice.actions };
export const appReducer = slice.reducer;
