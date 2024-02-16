import { SIZE, modifiers } from "../config/constants";
import { CellType } from "../types/types";
import Bomb from "./Bomb";

const Cell = ({ cell, position }: { cell: CellType; position: number[] }) => {
    const colors = {
        player: "white",
        empty: "red",
        hardWall: "black",
        softWall: "grey",
    };

    const cellSize = `calc((100vh - 10rem) / ${SIZE})`;

    const explosionSymbol = {
        cross: "+",
        horizontal: "⸺",
        vertical: "|",
    };

    const cellStyle = {
        width: cellSize,
        height: cellSize,
        backgroundColor: colors[cell.status],
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    return (
        <div style={cellStyle}>
            {cell.hasBomb && <Bomb position={position} />}
            {cell.explosion && <div style={{ color: "yellow", fontSize: "2rem" }}>{explosionSymbol[cell.explosion]}</div>}
            {cell.status === "empty" && cell.modifier.action && !cell.explosion && <div style={{ fontSize: "2rem" }}>{modifiers[cell.modifier.action]}</div>}
        </div>
    );
};

export default Cell;
