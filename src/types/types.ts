export type CellType = {
    status: "empty" | "player" | "hardWall" | "softWall";
    hasBomb: boolean;
    explosion: "horizontal" | "vertical" | "cross" | null;
    modifier: "extraLength" | "extraSpeed" | "lowerSpeed" | null;
};

export type MatrixType = CellType[][];
export type Direction = "up" | "down" | "left" | "right";
