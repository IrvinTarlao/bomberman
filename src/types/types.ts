export type CellType = {
    status: "empty" | "player" | "hardWall" | "softWall";
    hasBomb: boolean;
    explosion: "horizontal" | "vertical" | "cross" | null;
    modifier: { action: "extraLength" | "extraSpeed" | "lowerSpeed" | null; id: string | null };
};

export type MatrixType = CellType[][];
export type Direction = "up" | "down" | "left" | "right";
