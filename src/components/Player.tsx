import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import useKeyPress from "../hooks/useKeyPress";
import { useEffect } from "react";
import { appActions } from "../store/AppSlice";
import { downOrRightLimit, getNextPositions, isNextPosInsideMatrix, isWall, upOrLeftLimit, updateMatrix } from "../utility/utils";
import { CellType, Direction, MatrixType } from "../types/types";

const Player = () => {
    const dispatch = useDispatch();

    const { matrix, playerPosition, playerExplosion, bombLength, speed, modifiers, nbOfBombs, nbOfBombsPlayed } = useSelector((state: RootState) => state.app);

    const arrowUp = useKeyPress("ArrowUp");
    const arrowDown = useKeyPress("ArrowDown");
    const arrowLeft = useKeyPress("ArrowLeft");
    const arrowRight = useKeyPress("ArrowRight");
    const spaceBar = useKeyPress(" ");

    useEffect(() => {
        if (spaceBar && !matrix[playerPosition[0]][playerPosition[1]].hasBomb && nbOfBombsPlayed < nbOfBombs) {
            dispatch(appActions.setNbOfBombsPlayed(nbOfBombsPlayed + 1));
            const newMatrix = updateMatrix({ matrix, playerPosition: playerPosition, hasBomb: true });
            dispatch(appActions.setMatrix(newMatrix));
        }
    }, [spaceBar, playerPosition, matrix, dispatch, nbOfBombsPlayed, nbOfBombs]);

    useEffect(() => {
        if (matrix.length) {
            const { id, action } = matrix[playerPosition[0]][playerPosition[1]]?.modifier as CellType["modifier"];
            if (action !== null) {
                const nextModifiersState = modifiers.filter((mod) => mod.id !== id);
                const newMatrix = matrix.map((row: CellType[], rowIndex: number) =>
                    row.map((cell: CellType, cellIndex: number) => {
                        if (cell.modifier.action && rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) return { ...cell, modifier: { ...cell.modifier, action: null } };
                        else return cell;
                    })
                );
                if (action === "extraLength") {
                    dispatch(appActions.setBombLength(bombLength + 1));
                }
                if (action === "extraBomb") {
                    dispatch(appActions.setNbOfBombs(nbOfBombs + 1));
                }
                if (action === "extraSpeed" || (action === "lowerSpeed" && modifiers.find((modifier) => modifier.id === id))) {
                    const newSpeed = action === "extraSpeed" ? speed - 20 : speed + 20;
                    dispatch(appActions.setSpeed(newSpeed));
                }
                dispatch(appActions.setModifiers(nextModifiersState));
                dispatch(appActions.setMatrix(newMatrix));
            }
        }
    }, [playerPosition, matrix, dispatch, bombLength, speed, modifiers, nbOfBombs]);

    useEffect(() => {
        if (playerExplosion) {
            const newMatrix = matrix.map((row: CellType[], rowIndex: number) =>
                row.map((cell: CellType, cellIndex: number) => {
                    cell.explosion && console.log(cell, rowIndex, cellIndex, playerPosition);
                    if (cell.explosion && rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) dispatch(appActions.setPlayerStatus("dead"));
                    return { ...cell, explosion: null };
                })
            );
            setTimeout(() => {
                dispatch(appActions.setMatrix(newMatrix));
                dispatch(appActions.setPlayerExplosion(false));
            }, 1000);
        }
    }, [playerPosition, matrix, dispatch, playerExplosion, modifiers]);

    useEffect(() => {
        const getNextPosition = ({ currentPosition, nextPosition, limit, direction }: { currentPosition: number; nextPosition: number; limit: number; direction: Direction }) => {
            const [rowPos, colPos] = getNextPositions(direction, playerPosition);
            return isNextPosInsideMatrix(nextPosition) ? (isWall(matrix[rowPos][colPos]) ? currentPosition : nextPosition) : limit;
        };

        const handleMatrixUpdate = ({ matrix, newPositions }: { matrix: MatrixType; newPositions: number[] }) => {
            dispatch(appActions.setPlayerPosition(newPositions));
            const newMatrix = updateMatrix({ matrix, playerPosition: newPositions });
            dispatch(appActions.setMatrix(newMatrix));
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

    return null;
};

export default Player;
