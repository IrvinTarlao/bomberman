import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import useKeyPress from "./useKeyPress";
import { useEffect, useState } from "react";
import { appActions } from "../store/AppSlice";
import { downOrRightLimit, isNextPosInsideMatrix, upOrLeftLimit, updateMatrix } from "../utility/utils";
import { CellType, Direction, MatrixType } from "../types/types";

const useUpdatedMatrix = () => {
    const dispatch = useDispatch();
    const { matrix, playerPosition, playerExplosion, bombLength, speed, modifiers, nbOfBombs, nbOfBombsPlayed } = useSelector((state: RootState) => state.app);

    const [updatedMatrix, setUpdatedMatrix] = useState<MatrixType>();

    const arrowUp = useKeyPress("ArrowUp");
    const arrowDown = useKeyPress("ArrowDown");
    const arrowLeft = useKeyPress("ArrowLeft");
    const arrowRight = useKeyPress("ArrowRight");
    const spaceBar = useKeyPress(" ");

    // handle bomb drop
    useEffect(() => {
        if (spaceBar && !matrix[playerPosition[0]][playerPosition[1]].hasBomb && nbOfBombsPlayed < nbOfBombs) {
            dispatch(appActions.setNbOfBombsPlayed(nbOfBombsPlayed + 1));
            const newMatrix = updateMatrix({ matrix, playerPosition: playerPosition, hasBomb: true });
            setUpdatedMatrix(newMatrix);
        }
    }, [spaceBar, playerPosition, matrix, dispatch, nbOfBombsPlayed, nbOfBombs]);

    //handle modifiers
    useEffect(() => {
        if (matrix.length) {
            const { id, action } = matrix[playerPosition[0]][playerPosition[1]]?.modifier as CellType["modifier"];
            if (action !== null && modifiers.find((modifier) => modifier.id === id)) {
                const nextModifiersState = modifiers.filter((mod) => mod.id !== id);
                const newMatrix = updateMatrix({ matrix, playerPosition, dispatch });

                if (action === "extraLength") {
                    dispatch(appActions.setBombLength(bombLength + 1));
                }
                if (action === "extraBomb") {
                    dispatch(appActions.setNbOfBombs(nbOfBombs + 1));
                }
                if (action === "extraSpeed" || action === "lowerSpeed") {
                    const newSpeed = action === "extraSpeed" ? speed - 20 : speed + 20;
                    dispatch(appActions.setSpeed(newSpeed));
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
                dispatch(appActions.setPlayerExplosion(false));
            }, 1000);
        }
    }, [playerPosition, matrix, dispatch, playerExplosion]);

    //handle player position
    useEffect(() => {
        const isWall = (cell: CellType) => cell.status === "hardWall" || cell.status === "softWall";

        const getNextPositions = (direction: Direction, position: number[]) => {
            let res: number[] = [];
            if (direction === "down") res = [position[0] + 1, position[1]];
            if (direction === "up") res = [position[0] - 1, position[1]];
            if (direction === "left") res = [position[0], position[1] - 1];
            if (direction === "right") res = [position[0], position[1] + 1];
            return res;
        };

        const getNextPosition = ({ currentPosition, nextPosition, limit, direction }: { currentPosition: number; nextPosition: number; limit: number; direction: Direction }) => {
            const [rowPos, colPos] = getNextPositions(direction, playerPosition);
            return isNextPosInsideMatrix(nextPosition) ? (isWall(matrix[rowPos][colPos]) ? currentPosition : nextPosition) : limit;
        };

        const handleMatrixUpdate = ({ matrix, newPositions }: { matrix: MatrixType; newPositions: number[] }) => {
            dispatch(appActions.setPlayerPosition(newPositions));
            const newMatrix = updateMatrix({ matrix, playerPosition: newPositions });
            setUpdatedMatrix(newMatrix);
        };

        const timeoutDown = setTimeout(() => {
            const nextRowPos = getNextPosition({ currentPosition: playerPosition[0], nextPosition: playerPosition[0] + 1, limit: downOrRightLimit, direction: "down" });
            handleMatrixUpdate({ matrix, newPositions: [nextRowPos, playerPosition[1]] });
        }, speed);

        const timeoutUp = setTimeout(() => {
            const nextRowPos = getNextPosition({ currentPosition: playerPosition[0], nextPosition: playerPosition[0] - 1, limit: upOrLeftLimit, direction: "up" });
            handleMatrixUpdate({ matrix, newPositions: [nextRowPos, playerPosition[1]] });
        }, speed);

        const timeoutLeft = setTimeout(() => {
            const nextColPos = getNextPosition({ currentPosition: playerPosition[1], nextPosition: playerPosition[1] - 1, limit: upOrLeftLimit, direction: "left" });
            handleMatrixUpdate({ matrix, newPositions: [playerPosition[0], nextColPos] });
        }, speed);
        const timeoutRight = setTimeout(() => {
            const nextColPos = getNextPosition({ currentPosition: playerPosition[1], nextPosition: playerPosition[1] + 1, limit: downOrRightLimit, direction: "right" });
            handleMatrixUpdate({ matrix, newPositions: [playerPosition[0], nextColPos] });
        }, speed);

        arrowDown ? timeoutDown : clearTimeout(timeoutDown);
        arrowUp ? timeoutUp : clearTimeout(timeoutUp);
        arrowLeft ? timeoutLeft : clearTimeout(timeoutLeft);
        arrowRight ? timeoutRight : clearTimeout(timeoutRight);
    }, [arrowDown, arrowUp, arrowRight, arrowLeft, playerPosition, speed, matrix, dispatch]);

    return updatedMatrix;
};

export default useUpdatedMatrix;
