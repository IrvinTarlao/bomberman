import { useEffect, useState } from "react";
import Cell from "./Cell";
import useKeyPress from "../hooks/useKeyPress";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../store/AppSlice";
import { CellType, Direction, MatrixType } from "../types/types";
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

        const getNextPositions = (direction: Direction) => {
            let res: number[] = [];
            if (direction === "down") res = [playerPosition[0] + 1, playerPosition[1]];
            if (direction === "up") res = [playerPosition[0] - 1, playerPosition[1]];
            if (direction === "left") res = [playerPosition[0], playerPosition[1] - 1];
            if (direction === "right") res = [playerPosition[0], playerPosition[1] + 1];
            return res;
        };

        const getNextPosition = ({ currentPosition, nextPosition, limit, direction }: { currentPosition: number; nextPosition: number; limit: number; direction: Direction }) => {
            const [rowPos, colPos] = getNextPositions(direction);

            const isNextPosInsideMatrix = (direction: Direction) => {
                if (direction === "down" || direction === "right") return nextPosition < limit;
                if (direction === "up" || direction === "left") return nextPosition > limit;
            };

            return isNextPosInsideMatrix(direction) ? (isWall(matrix[rowPos][colPos]) ? currentPosition : nextPosition) : limit;
        };

        const handleMatrixUpdate = ({ matrix, newPositions }: { matrix: MatrixType; newPositions: number[] }) => {
            dispatch(appActions.setPlayerPosition(newPositions));
            const newMatrix = updateMatrix({ matrix, playerPosition: newPositions });
            dispatch(appActions.setMatrix(newMatrix));
        };

        const timeoutDown = setTimeout(() => {
            const nextRowPos = getNextPosition({ currentPosition: playerPosition[0], nextPosition: playerPosition[0] + 1, limit: size - 1, direction: "down" });
            handleMatrixUpdate({ matrix, newPositions: [nextRowPos, playerPosition[1]] });
        }, speed);

        const timeoutUp = setTimeout(() => {
            const nextRowPos = getNextPosition({ currentPosition: playerPosition[0], nextPosition: playerPosition[0] - 1, limit: 0, direction: "up" });
            handleMatrixUpdate({ matrix, newPositions: [nextRowPos, playerPosition[1]] });
        }, speed);

        const timeoutLeft = setTimeout(() => {
            const nextColPos = getNextPosition({ currentPosition: playerPosition[1], nextPosition: playerPosition[1] - 1, limit: 0, direction: "left" });
            handleMatrixUpdate({ matrix, newPositions: [playerPosition[0], nextColPos] });
        }, speed);
        const timeoutRight = setTimeout(() => {
            const nextColPos = getNextPosition({ currentPosition: playerPosition[1], nextPosition: playerPosition[1] + 1, limit: size - 1, direction: "right" });
            handleMatrixUpdate({ matrix, newPositions: [playerPosition[0], nextColPos] });
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
