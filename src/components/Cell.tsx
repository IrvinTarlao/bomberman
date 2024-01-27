import { CellType } from "../types/types";
import Bomb from "./Bomb";

const Cell = ({ cell, size, position }: { cell: CellType; size: number; position: number[] }) => {
    const colors = {
        player: "white",
        empty: "red",
        hardWall: "black",
        softWall: "grey",
    };
    const cellSize = `calc((100vh - 10rem) / ${size})`;
    const style = { width: cellSize, height: cellSize, border: "1px solid white", backgroundColor: colors[cell.status], display: "flex", justifyContent: "center", alignItems: "center" };
    return <div style={style}>{cell.hasBomb ? <Bomb position={position} /> : ""}</div>;
};

export default Cell;
