import { useCallback, useEffect, useState } from "react";
import Cell from "./Cell";
import useKeyPress from "../hooks/useKeyPress";

export type CellType = {
    status: "empty" | "player" | "hardWall" | "softWall";
    hasBomb: boolean;
};

const Matrix = () => {
    const size = 11;
    const speed = 200;
    const [matrix, setMatrix] = useState<CellType[][]>([]);
    const [playerPos, setPlayerPos] = useState([0, 0]);
    const [init, setInit] = useState(true);

    // const movePlayer = useCallback((matrix: CellType[][], rowNumber: number, colNumber: number) => {
    //     const newMatrix = [...matrix];
    //     const targetRow = [...newMatrix[rowNumber]];
    //     targetRow[colNumber] = "player";
    //     newMatrix[rowNumber] = targetRow;
    //     return newMatrix;
    // }, []);

    const updateMatrix = useCallback(({ matrix, playerPosition, hasBomb = false }: { matrix: CellType[][]; playerPosition: number[]; hasBomb?: boolean }) => {
        return matrix.map((row: CellType[], rowIndex: number) => {
            return row.map((cell: CellType, cellIndex: number) => {
                if (rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) return { ...cell, status: "player", hasBomb };
                if ((rowIndex === 0 && (cellIndex === 0 || cellIndex === 1)) || (rowIndex === 1 && cellIndex === 0)) return { ...cell, status: "empty" };
                if (rowIndex % 2 === 1 && cellIndex % 2 === 1) return { ...cell, status: "hardWall" };
                // else if (cell === "player") return "empty";
                else return { ...cell, status: "softWall" };
            });
        }) as CellType[][];
    }, []);

    useEffect(() => {
        if (init) {
            const withWalls = updateMatrix({ matrix: Array(size).fill(Array(size).fill({ status: "softWall", hasBomb: false })), playerPosition: [0, 0] });
            setMatrix(withWalls);
            setInit(false);
        }
    }, [init, updateMatrix]);

    const arrowUp = useKeyPress("ArrowUp");
    const arrowDown = useKeyPress("ArrowDown");
    const arrowLeft = useKeyPress("ArrowLeft");
    const arrowRight = useKeyPress("ArrowRight");
    const spaceBar = useKeyPress(" ");

    useEffect(() => {
        if (spaceBar && !matrix[playerPos[0]][playerPos[1]].hasBomb) {
            const newMatrix = updateMatrix({ matrix, playerPosition: playerPos, hasBomb: true });
            setMatrix(newMatrix);
        }
    }, [spaceBar, updateMatrix, playerPos, matrix]);

    const isWall = (cell: CellType) => cell.status === "hardWall" || cell.status === "softWall";

    useEffect(() => {
        const timeoutDown = setTimeout(() => {
            const nextRowPos = playerPos[0] + 1 < size - 1 ? (isWall(matrix[playerPos[0] + 1][playerPos[1]]) ? playerPos[0] : playerPos[0] + 1) : size - 1;
            setPlayerPos([nextRowPos, playerPos[1]]);
            const newMatrix = updateMatrix({ matrix, playerPosition: [nextRowPos, playerPos[1]] });
            setMatrix(newMatrix);
        }, speed);
        const timeoutUp = setTimeout(() => {
            const nextRowPos = playerPos[0] - 1 > 0 ? (isWall(matrix[playerPos[0] - 1][playerPos[1]]) ? playerPos[0] : playerPos[0] - 1) : 0;
            setPlayerPos([nextRowPos, playerPos[1]]);
            const newMatrix = updateMatrix({ matrix, playerPosition: [nextRowPos, playerPos[1]] });
            setMatrix(newMatrix);
        }, speed);
        const timeoutLeft = setTimeout(() => {
            const nextColPos = playerPos[1] - 1 > 0 ? (isWall(matrix[playerPos[0]][playerPos[1] - 1]) ? playerPos[1] : playerPos[1] - 1) : 0;
            setPlayerPos([playerPos[0], nextColPos]);
            const newMatrix = updateMatrix({ matrix, playerPosition: [playerPos[0], nextColPos] });
            setMatrix(newMatrix);
        }, speed);
        const timeoutRight = setTimeout(() => {
            const nextColPos = playerPos[1] + 1 < size - 1 ? (isWall(matrix[playerPos[0]][playerPos[1] + 1]) ? playerPos[1] : playerPos[1] + 1) : size - 1;
            setPlayerPos([playerPos[0], nextColPos]);
            const newMatrix = updateMatrix({ matrix, playerPosition: [playerPos[0], nextColPos] });
            setMatrix(newMatrix);
        }, speed);

        arrowDown ? timeoutDown : clearTimeout(timeoutDown);
        arrowUp ? timeoutUp : clearTimeout(timeoutUp);
        arrowLeft ? timeoutLeft : clearTimeout(timeoutLeft);
        arrowRight ? timeoutRight : clearTimeout(timeoutRight);
    }, [arrowDown, arrowUp, arrowRight, arrowLeft, playerPos, updateMatrix, size, speed, matrix]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {matrix.map((row, rowIndex) => (
                <div style={{ display: "flex", flexDirection: "row" }} key={rowIndex}>
                    {row.map((cell: CellType, cellIndex: number) => (
                        <Cell cell={cell} key={rowIndex + cellIndex} size={size} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Matrix;
