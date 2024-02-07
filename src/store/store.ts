import { configureStore } from "@reduxjs/toolkit";

import { appReducer } from "./AppSlice";
import { playerOneReducer } from "./PlayerOneSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        playerOne: playerOneReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
