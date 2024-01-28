export type CellType = {
    status: "empty" | "player" | "hardWall" | "softWall";
    hasBomb: boolean;
};

export type MatrixType = CellType[][];
export type Direction = "up" | "down" | "left" | "right";
