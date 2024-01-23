import { useCallback, useEffect, useState } from "react";
import Cell from "./Cell";
import useKeyPress from "../hooks/useKeyPress";

export type CellType = "empty" | "player" | "wall" | "bomb";

const Matrix = () => {
    const size = 11;
    const speed = 200;
    const [initMatrix, setInitMatrix] = useState<CellType[][]>([]);
    const [matrix, setMatrix] = useState<CellType[][]>([]);
    const [playerPos, setPlayerPos] = useState([0, 0]);
    const [init, setInit] = useState(true);

    const updateMatrix = useCallback(
        (rowNumber: number, colNumber: number) => {
            const newMatrix = [...initMatrix];
            const targetRow = [...newMatrix[rowNumber]];
            targetRow[colNumber] = "player";
            newMatrix[rowNumber] = targetRow;
            return newMatrix;
        },
        [initMatrix]
    );

    const generateWalls = useCallback((matrix: CellType[][]) => {
        return matrix.map((row: CellType[], rowIndex: number) => {
            if (rowIndex % 2 === 1) {
                return row.map((cell: CellType, cellIndex: number) => {
                    if (cellIndex % 2 === 1) return "wall";
                    else return cell;
                });
            } else return row;
        });
    }, []);

    useEffect(() => {
        if (init) {
            const withWalls = generateWalls(Array(size).fill(Array(size).fill("empty")));
            setInitMatrix(withWalls);
            setInit(false);
        }
    }, [init, generateWalls]);

    useEffect(() => {
        if (initMatrix.length > 0) {
            const newMatrix = updateMatrix(playerPos[0], playerPos[1]);
            setMatrix(newMatrix);
        }
    }, [initMatrix, updateMatrix, playerPos]);

    const arrowUp = useKeyPress("ArrowUp");
    const arrowDown = useKeyPress("ArrowDown");
    const arrowLeft = useKeyPress("ArrowLeft");
    const arrowRight = useKeyPress("ArrowRight");
    const spaceBar = useKeyPress(" ");

    useEffect(() => {
        if (spaceBar) console.log("spaceBar");
    }, [spaceBar]);

    useEffect(() => {
        const timeoutDown = setTimeout(() => {
            const nextRowPos = playerPos[0] + 1 < size - 1 ? (matrix[playerPos[0] + 1][playerPos[1]] === "wall" ? playerPos[0] : playerPos[0] + 1) : size - 1;
            setPlayerPos([nextRowPos, playerPos[1]]);
            const newMatrix = updateMatrix(nextRowPos, playerPos[1]);
            setMatrix(newMatrix);
        }, speed);
        const timeoutUp = setTimeout(() => {
            const nextRowPos = playerPos[0] - 1 > 0 ? (matrix[playerPos[0] - 1][playerPos[1]] === "wall" ? playerPos[0] : playerPos[0] - 1) : 0;
            setPlayerPos([nextRowPos, playerPos[1]]);
            const newMatrix = updateMatrix(nextRowPos, playerPos[1]);
            setMatrix(newMatrix);
        }, speed);
        const timeoutLeft = setTimeout(() => {
            const nextColPos = playerPos[1] - 1 > 0 ? (matrix[playerPos[0]][playerPos[1] - 1] === "wall" ? playerPos[1] : playerPos[1] - 1) : 0;
            setPlayerPos([playerPos[0], nextColPos]);
            const newMatrix = updateMatrix(playerPos[0], nextColPos);
            setMatrix(newMatrix);
        }, speed);
        const timeoutRight = setTimeout(() => {
            const nextColPos = playerPos[1] + 1 < size - 1 ? (matrix[playerPos[0]][playerPos[1] + 1] === "wall" ? playerPos[1] : playerPos[1] + 1) : size - 1;
            setPlayerPos([playerPos[0], nextColPos]);
            const newMatrix = updateMatrix(playerPos[0], nextColPos);
            setMatrix(newMatrix);
        }, speed);

        arrowDown ? timeoutDown : clearTimeout(timeoutDown);
        arrowUp ? timeoutUp : clearTimeout(timeoutUp);
        arrowLeft ? timeoutLeft : clearTimeout(timeoutLeft);
        arrowRight ? timeoutRight : clearTimeout(timeoutRight);

        // if (arrowDown) {
        // setTimeout(() => {
        //     const nextRowPos = playerPos[0] + 1 < size - 1 ? playerPos[0] + 1 : size - 1;
        //     setPlayerPos([nextRowPos, playerPos[1]]);
        //     const newMatrix = updateMatrix(nextRowPos, playerPos[1]);
        //     setMatrix(newMatrix);
        // }, speed);
        // if (arrowUp) {
        //     setTimeout(() => {
        //         const nextRowPos = playerPos[0] - 1 > 0 ? playerPos[0] - 1 : 0;
        //         setPlayerPos([nextRowPos, playerPos[1]]);
        //         const newMatrix = updateMatrix(nextRowPos, playerPos[1]);
        //         setMatrix(newMatrix);
        //     }, speed);
        // } else if (arrowLeft) {
        //     setTimeout(() => {
        //         const nextColPos = playerPos[1] - 1 > 0 ? playerPos[1] - 1 : 0;
        //         setPlayerPos([playerPos[0], nextColPos]);
        //         const newMatrix = updateMatrix(playerPos[0], nextColPos);
        //         setMatrix(newMatrix);
        //     }, speed);
        // } else if (arrowRight) {
        //     setTimeout(() => {
        //         const nextColPos = playerPos[1] + 1 < size - 1 ? playerPos[1] + 1 : size - 1;
        //         setPlayerPos([playerPos[0], nextColPos]);
        //         const newMatrix = updateMatrix(playerPos[0], nextColPos);
        //         setMatrix(newMatrix);
        //     }, speed);
        // }
    }, [arrowDown, arrowUp, arrowRight, arrowLeft, playerPos, updateMatrix, size, speed, matrix]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {matrix.map((row, rowIndex) => (
                <div style={{ display: "flex", flexDirection: "row" }} key={rowIndex}>
                    {row.map((cell: CellType, cellIndex: number) => (
                        <Cell cell={cell} key={rowIndex + cellIndex} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Matrix;
