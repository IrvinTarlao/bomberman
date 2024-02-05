import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getInitialMatrix, updateMatrix } from "../utility/utils";
import Matrix from "./Matrix";
import GameOver from "./GameOver";
import usePlayerPosition from "../hooks/usePlayerPosition";
import { appActions } from "../store/AppSlice";

const Game = () => {
    const dispatch = useDispatch();

    const { matrix, playerStatus, playerPosition } = useSelector((state: RootState) => state.app);

    const nextPlayerPosition = usePlayerPosition();

    const [init, setInit] = useState(true);

    useEffect(() => {
        if (init) {
            getInitialMatrix(dispatch);
            setInit(false);
        }
    }, [init, dispatch]);

    useEffect(() => {
        if (playerPosition[0] !== nextPlayerPosition[0] || playerPosition[1] !== nextPlayerPosition[1]) {
            dispatch(appActions.setPlayerPosition(nextPlayerPosition));
            const newMatrix = updateMatrix({ matrix, playerPosition: nextPlayerPosition });
            dispatch(appActions.setMatrix(newMatrix));
        }
    }, [matrix, playerPosition, nextPlayerPosition, dispatch]);

    return <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>{playerStatus === "alive" ? <Matrix /> : <GameOver onRetryClick={() => setInit(true)} />}</div>;
};

export default Game;
