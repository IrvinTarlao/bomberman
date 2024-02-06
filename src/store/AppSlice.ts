import { createSlice } from "@reduxjs/toolkit";
import { CellType, MatrixType } from "../types/types";

// state

type InitialState = {
    matrix: MatrixType;
    modifiers: CellType["modifier"][];
};

const name = "app";
const initialState = {
    matrix: [],
    modifiers: [],
} as InitialState;

const slice = createSlice({
    name,
    initialState,
    reducers: {
        setMatrix: (state, action) => {
            state.matrix = action.payload;
        },
        setModifiers: (state, action) => {
            state.modifiers = action.payload;
        },
        setInitialState: (_, action) => {
            return { matrix: action.payload.matrix, modifiers: action.payload.modifiers };
        },
    },
});

// exports

export const appActions = { ...slice.actions };
export const appReducer = slice.reducer;
