import { createSlice } from "@reduxjs/toolkit";
import { CellType, MatrixType } from "../types/types";

// state

type InitialState = {
    matrix: MatrixType;
    playerPosition: number[];
    playerStatus: "alive" | "dead";
    playerExplosion: boolean;
    bombLength: number;
    speed: number;
    modifiers: CellType["modifier"][];
};

const name = "app";
const initialState = {
    matrix: [],
    playerPosition: [0, 0],
    playerStatus: "alive",
    playerExplosion: false,
    bombLength: 3,
    speed: 200,
    modifiers: [],
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
        setSpeed: (state, action) => {
            state.speed = action.payload;
        },
        setModifiers: (state, action) => {
            state.modifiers = action.payload;
        },
    },
});

// exports

export const appActions = { ...slice.actions };
export const appReducer = slice.reducer;
