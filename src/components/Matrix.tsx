import { useCallback, useEffect, useState } from "react";
import Cell from "./Cell";
import useKeyPress from "../hooks/useKeyPress";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../store/AppSlice";
import { CellType, Direction, MatrixType } from "../types/types";
import { RootState } from "../store/store";
import { SIZE, downOrRightLimit, getNextPositions, isNextPosInsideMatrix, isWall, upOrLeftLimit, updateMatrix } from "../utility/utils";

const Matrix = () => {
    const dispatch = useDispatch();

    const speed = 200;
    const matrix = useSelector((state: RootState) => state.app.matrix);
    const playerPosition = useSelector((state: RootState) => state.app.playerPosition);
    const playerStatus = useSelector((state: RootState) => state.app.playerStatus);
    const [init, setInit] = useState(true);

    const initializeMatrix = useCallback(() => {
        const playerPosition = [0, 0];
        const withWalls = updateMatrix({ matrix: Array(SIZE).fill(Array(SIZE).fill({ status: "softWall", hasBomb: false })), playerPosition });
        dispatch(appActions.setMatrix(withWalls));
        dispatch(appActions.setPlayerPosition(playerPosition));
        dispatch(appActions.setPlayerStatus("alive"));
        setInit(false);
    }, [dispatch]);

    useEffect(() => {
        if (init) {
            initializeMatrix();
        }
    }, [init, initializeMatrix]);

    const arrowUp = useKeyPress("ArrowUp");
    const arrowDown = useKeyPress("ArrowDown");
    const arrowLeft = useKeyPress("ArrowLeft");
    const arrowRight = useKeyPress("ArrowRight");
    const spaceBar = useKeyPress(" ");

    useEffect(() => {
        if (spaceBar && !matrix[playerPosition[0]][playerPosition[1]].hasBomb) {
            const newMatrix = updateMatrix({ matrix, playerPosition: playerPosition, hasBomb: true });
            dispatch(appActions.setMatrix(newMatrix));
        }
    }, [spaceBar, playerPosition, matrix, dispatch]);

    useEffect(() => {
        const getNextPosition = ({ currentPosition, nextPosition, limit, direction }: { currentPosition: number; nextPosition: number; limit: number; direction: Direction }) => {
            const [rowPos, colPos] = getNextPositions(direction, playerPosition);
            return isNextPosInsideMatrix(direction, nextPosition) ? (isWall(matrix[rowPos][colPos]) ? currentPosition : nextPosition) : limit;
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

    return (
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            {matrix.map((row, rowIndex) => (
                <div style={{ display: "flex", flexDirection: "row" }} key={rowIndex}>
                    {row.map((cell: CellType, cellIndex: number) => (
                        <Cell cell={cell} key={rowIndex + cellIndex} position={[rowIndex, cellIndex]} />
                    ))}
                </div>
            ))}
            {playerStatus === "dead" && (
                <div style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "blue", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <p>you're dead</p>
                    <button onClick={() => initializeMatrix()}>retry</button>
                </div>
            )}
        </div>
    );
};

export default Matrix;
