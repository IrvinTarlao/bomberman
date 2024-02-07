import { createSlice } from "@reduxjs/toolkit";

// state

type InitialState = {
    playerPosition: number[];
    playerStatus: "alive" | "dead";
    playerExplosion: boolean;
    bombLength: number;
    speed: number;
    nbOfBombs: number;
    nbOfBombsPlayed: number;
};

const name = "playerOne";
const initialState = {
    playerPosition: [0, 0],
    playerStatus: "alive",
    playerExplosion: false,
    bombLength: 3,
    speed: 200,
    nbOfBombs: 1,
    nbOfBombsPlayed: 0,
} as InitialState;

const slice = createSlice({
    name,
    initialState,
    reducers: {
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
        setNbOfBombs: (state, action) => {
            state.nbOfBombs = action.payload;
        },
        setNbOfBombsPlayed: (state, action) => {
            state.nbOfBombsPlayed = action.payload;
        },
        setInitialState: () => {
            return initialState;
        },
    },
});

// exports

export const playerOneActions = { ...slice.actions };
export const playerOneReducer = slice.reducer;
