import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { appActions } from "../store/AppSlice";
import { isPositionEqual, updateMatrix } from "../utility/utils";
import { CellType, MatrixType } from "../types/types";
import { playerOneActions } from "../store/PlayerOneSlice";
import usePlayerPosition from "./usePlayerPosition";
import useBombDrop from "./useBombDrop";

const useUpdatedMatrix = () => {
    const dispatch = useDispatch();
    const { matrix, modifiers } = useSelector((state: RootState) => state.app);
    const { playerPosition, playerExplosion, bombLength, speed, nbOfBombs, nbOfBombsPlayed } = useSelector((state: RootState) => state.playerOne);

    const [updatedMatrix, setUpdatedMatrix] = useState<MatrixType>();

    const isBombDropped = useBombDrop();
    const nextPlayerPosition = usePlayerPosition();

    // handle bomb drop
    useEffect(() => {
        if (isBombDropped && !matrix[playerPosition[0]][playerPosition[1]].hasBomb && nbOfBombsPlayed + 1 <= nbOfBombs) {
            dispatch(playerOneActions.setNbOfBombsPlayed(nbOfBombsPlayed + 1));
            const newMatrix = updateMatrix({ matrix, playerPosition, hasBomb: true });
            setUpdatedMatrix(newMatrix);
        }
    }, [isBombDropped, playerPosition, matrix, dispatch, nbOfBombs, nbOfBombsPlayed]);

    //handle modifiers
    useEffect(() => {
        if (matrix.length) {
            const { id, action } = matrix[playerPosition[0]][playerPosition[1]]?.modifier as CellType["modifier"];
            if (action !== null && modifiers.find((modifier) => modifier.id === id)) {
                const nextModifiersState = modifiers.filter((mod) => mod.id !== id);
                const newMatrix = updateMatrix({ matrix, playerPosition, dispatch });

                if (action === "extraLength") {
                    dispatch(playerOneActions.setBombLength(bombLength + 1));
                }
                if (action === "extraBomb") {
                    dispatch(playerOneActions.setNbOfBombs(nbOfBombs + 1));
                }
                if (action === "extraSpeed" || action === "lowerSpeed") {
                    const newSpeed = action === "extraSpeed" ? speed - 20 : speed + 20;
                    dispatch(playerOneActions.setSpeed(newSpeed));
                }
                dispatch(appActions.setModifiers(nextModifiersState));
                setUpdatedMatrix(newMatrix);
            }
        }
    }, [playerPosition, matrix, dispatch, bombLength, speed, modifiers, nbOfBombs]);

    //handle player explosion
    useEffect(() => {
        if (playerExplosion) {
            const newMatrix = updateMatrix({ matrix, playerPosition, dispatch, playerExplosionEnd: true });
            setTimeout(() => {
                setUpdatedMatrix(newMatrix);
                dispatch(playerOneActions.setPlayerExplosion(false));
            }, 1000);
        }
    }, [playerPosition, matrix, dispatch, playerExplosion]);

    //handle player position
    useEffect(() => {
        if (!isPositionEqual(nextPlayerPosition, playerPosition)) {
            dispatch(playerOneActions.setPlayerPosition(nextPlayerPosition));
            const newMatrix = updateMatrix({ matrix, playerPosition: nextPlayerPosition });
            setUpdatedMatrix(newMatrix);
        }
    }, [nextPlayerPosition, matrix, dispatch, playerPosition]);

    return updatedMatrix;
};

export default useUpdatedMatrix;
