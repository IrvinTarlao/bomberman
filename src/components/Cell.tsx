import { CellType } from "../types/types";
import { SIZE } from "../utility/utils";
import Bomb from "./Bomb";

const Cell = ({ cell, position }: { cell: CellType; position: number[] }) => {
    const colors = {
        player: "white",
        empty: "red",
        hardWall: "black",
        softWall: "grey",
    };
    const cellSize = `calc((100vh - 10rem) / ${SIZE})`;
    const modifiers = {
        extraLength: "+",
        extraBomb: "o",
        extraSpeed: ">>",
        lowerSpeed: "slow",
    };
    return (
        <div
            style={{
                position: "relative",
                width: cellSize,
                height: cellSize,
                // border: "1px solid white",
                backgroundColor: colors[cell.status],
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {cell.hasBomb ? <Bomb position={position} /> : ""}
            {cell.explosion && <div style={{ color: "yellow", fontSize: "2rem" }}>{cell.explosion === "cross" ? "+" : cell.explosion === "horizontal" ? "-" : "|"}</div>}
            {
                // cell.status === "empty" &&
                cell?.modifier?.action && !cell.explosion && <div style={{ color: "pink", fontSize: "2rem" }}>{modifiers[cell.modifier.action]}</div>
            }
        </div>
    );
};

export default Cell;
