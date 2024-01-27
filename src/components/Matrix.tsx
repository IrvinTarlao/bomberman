import { useEffect, useState } from "react";
import Cell from "./Cell";
import useKeyPress from "../hooks/useKeyPress";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../store/AppSlice";
import { CellType } from "../types/types";
import { RootState } from "../store/store";
import { updateMatrix } from "../utility/utils";

const Matrix = () => {
    const dispatch = useDispatch();

    const size = 11;
    const speed = 200;
    const matrix = useSelector((state: RootState) => state.app.matrix);
    const playerPosition = useSelector((state: RootState) => state.app.playerPosition);
    const [init, setInit] = useState(true);

    useEffect(() => {
        if (init) {
            const withWalls = updateMatrix({ matrix: Array(size).fill(Array(size).fill({ status: "softWall", hasBomb: false })), playerPosition: [0, 0] });
            dispatch(appActions.setMatrix(withWalls));
            setInit(false);
        }
    }, [init, dispatch]);

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
        const isWall = (cell: CellType) => cell.status === "hardWall" || cell.status === "softWall";
        const getNextPosition = ({
            currentPosition,
            nextPosition,
            limit,
            direction,
        }: {
            currentPosition: number;
            nextPosition: number;
            limit: number;
            direction: "up" | "down" | "left" | "right";
        }) => {
            // if (direction === "down")
            return nextPosition < limit ? (isWall(matrix[nextPosition][playerPosition[1]]) ? playerPosition[0] : nextPosition) : limit;
        };
        const timeoutDown = setTimeout(() => {
            const nextRowPos = getNextPosition({ currentPosition: playerPosition[0], nextPosition: playerPosition[0] + 1, limit: size - 1, direction: "down" });
            dispatch(appActions.setPlayerPosition([nextRowPos, playerPosition[1]]));
            const newMatrix = updateMatrix({ matrix, playerPosition: [nextRowPos, playerPosition[1]] });
            dispatch(appActions.setMatrix(newMatrix));
        }, speed);
        const timeoutUp = setTimeout(() => {
            const nextRowPos = playerPosition[0] - 1 > 0 ? (isWall(matrix[playerPosition[0] - 1][playerPosition[1]]) ? playerPosition[0] : playerPosition[0] - 1) : 0;
            dispatch(appActions.setPlayerPosition([nextRowPos, playerPosition[1]]));
            const newMatrix = updateMatrix({ matrix, playerPosition: [nextRowPos, playerPosition[1]] });
            dispatch(appActions.setMatrix(newMatrix));
        }, speed);
        const timeoutLeft = setTimeout(() => {
            const nextColPos = playerPosition[1] - 1 > 0 ? (isWall(matrix[playerPosition[0]][playerPosition[1] - 1]) ? playerPosition[1] : playerPosition[1] - 1) : 0;
            dispatch(appActions.setPlayerPosition([playerPosition[0], nextColPos]));
            const newMatrix = updateMatrix({ matrix, playerPosition: [playerPosition[0], nextColPos] });
            dispatch(appActions.setMatrix(newMatrix));
        }, speed);
        const timeoutRight = setTimeout(() => {
            const nextColPos = playerPosition[1] + 1 < size - 1 ? (isWall(matrix[playerPosition[0]][playerPosition[1] + 1]) ? playerPosition[1] : playerPosition[1] + 1) : size - 1;
            dispatch(appActions.setPlayerPosition([playerPosition[0], nextColPos]));
            const newMatrix = updateMatrix({ matrix, playerPosition: [playerPosition[0], nextColPos] });
            dispatch(appActions.setMatrix(newMatrix));
        }, speed);

        arrowDown ? timeoutDown : clearTimeout(timeoutDown);
        arrowUp ? timeoutUp : clearTimeout(timeoutUp);
        arrowLeft ? timeoutLeft : clearTimeout(timeoutLeft);
        arrowRight ? timeoutRight : clearTimeout(timeoutRight);
    }, [arrowDown, arrowUp, arrowRight, arrowLeft, playerPosition, size, speed, matrix, dispatch]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {matrix.map((row, rowIndex) => (
                <div style={{ display: "flex", flexDirection: "row" }} key={rowIndex}>
                    {row.map((cell: CellType, cellIndex: number) => (
                        <Cell cell={cell} key={rowIndex + cellIndex} size={size} position={[rowIndex, cellIndex]} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Matrix;
