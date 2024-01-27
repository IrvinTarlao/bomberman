import { CellType, MatrixType } from "../types/types";

export const updateMatrix = ({ matrix, playerPosition, hasBomb = false }: { matrix: MatrixType; playerPosition: number[]; hasBomb?: boolean }) => {
    return matrix.map((row: CellType[], rowIndex: number) => {
        return row.map((cell: CellType, cellIndex: number) => {
            if (rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) return { ...cell, status: "player", hasBomb: hasBomb || cell.hasBomb };
            if ((rowIndex === 0 && (cellIndex === 0 || cellIndex === 1)) || (rowIndex === 1 && cellIndex === 0)) return { ...cell, status: "empty" };
            if (rowIndex % 2 === 1 && cellIndex % 2 === 1) return { ...cell, status: "hardWall" };
            // else if (cell === "player") return "empty";
            else return { ...cell, status: "softWall" };
        });
    }) as MatrixType;
};
