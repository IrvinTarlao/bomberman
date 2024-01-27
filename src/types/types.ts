export type CellType = {
    status: "empty" | "player" | "hardWall" | "softWall";
    hasBomb: boolean;
};

export type MatrixType = CellType[][];
