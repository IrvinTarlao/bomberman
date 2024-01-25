import Bomb from "./Bomb";
import { CellType } from "./Matrix";

const Cell = ({ cell, size }: { cell: CellType; size: number }) => {
    const colors = {
        player: "white",
        empty: "red",
        hardWall: "black",
        softWall: "grey",
    };
    const cellSize = `calc((100vh - 10rem) / ${size})`;
    const style = { width: cellSize, height: cellSize, border: "1px solid white", backgroundColor: colors[cell.status], display: "flex", justifyContent: "center", alignItems: "center" };
    return <div style={style}>{cell.hasBomb ? <Bomb /> : ""}</div>;
};

export default Cell;
