import { createSlice } from "@reduxjs/toolkit";
import { MatrixType } from "../types/types";

// state

type InitialState = {
    matrix: MatrixType;
    playerPosition: number[];
    playerStatus: "alive" | "dead";
    playerExplosion: boolean;
    bombLength: number;
};

const name = "app";
const initialState = {
    matrix: [],
    playerPosition: [0, 0],
    playerStatus: "alive",
    playerExplosion: false,
    bombLength: 2,
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
        setPlayerStatus: (state, action) => {
            state.playerStatus = action.payload;
        },
        setPlayerExplosion: (state, action) => {
            state.playerExplosion = action.payload;
        },
        setBombLength: (state, action) => {
            state.bombLength = action.payload;
        },
    },
});

// exports

export const appActions = { ...slice.actions };
export const appReducer = slice.reducer;
