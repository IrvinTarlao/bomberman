import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getInitialMatrix } from "../utility/utils";
import Matrix from "../components/Matrix";
import GameOver from "../components/GameOver";

const Game = () => {
    const playerStatus = useSelector((state: RootState) => state.app.playerStatus);
    const dispatch = useDispatch();

    const [init, setInit] = useState(true);

    useEffect(() => {
        if (init) {
            getInitialMatrix(dispatch);
            setInit(false);
        }
    }, [init, dispatch]);

    return <div>{playerStatus === "alive" ? <Matrix /> : <GameOver onRetryClick={() => setInit(true)} />}</div>;
};

export default Game;
