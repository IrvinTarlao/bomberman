import { CellType, Direction, MatrixType } from "../types/types";

export const HEIGHT = "calc(100vh - 10rem)";
export const SIZE = 11;
export const downOrRightLimit = SIZE - 1;
export const upOrLeftLimit = 0;

export const updateMatrix = ({ matrix, playerPosition, hasBomb = false, clearExplosion = false }: { matrix: MatrixType; playerPosition: number[]; hasBomb?: boolean; clearExplosion?: boolean }) => {
    return matrix.map((row: CellType[], rowIndex: number) => {
        return row.map((cell: CellType, cellIndex: number) => {
            //update player position
            if (rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) return { ...cell, status: "player", hasBomb: hasBomb || cell.hasBomb };
            else {
                // keep first cells empty for initial map
                if ((rowIndex === 0 && (cellIndex === 0 || cellIndex === 1)) || (rowIndex === 1 && cellIndex === 0) || cell.status === "player")
                    return { ...cell, status: "empty", explosion: clearExplosion ? null : cell.explosion };
                // generate walls
                if (rowIndex % 2 === 1 && cellIndex % 2 === 1) return { ...cell, status: "hardWall" };
                else return { ...cell, explosion: clearExplosion ? null : cell.explosion };
            }
        });
    }) as MatrixType;
};

export const isWall = (cell: CellType) => cell.status === "hardWall" || cell.status === "softWall";

export const getNextPositions = (direction: Direction, position: number[]) => {
    let res: number[] = [];
    if (direction === "down") res = [position[0] + 1, position[1]];
    if (direction === "up") res = [position[0] - 1, position[1]];
    if (direction === "left") res = [position[0], position[1] - 1];
    if (direction === "right") res = [position[0], position[1] + 1];
    return res;
};

export const isNextPosInsideMatrix = (direction: Direction, nextPosition: number) => {
    if (direction === "down" || direction === "right") return nextPosition < downOrRightLimit;
    if (direction === "up" || direction === "left") return nextPosition >= upOrLeftLimit;
};
