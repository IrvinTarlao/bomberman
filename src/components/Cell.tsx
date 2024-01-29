import { useSelector } from "react-redux";
import { CellType } from "../types/types";
import { SIZE } from "../utility/utils";
import Bomb from "./Bomb";
import { RootState } from "../store/store";

const Cell = ({ cell, position }: { cell: CellType; position: number[] }) => {
    const playerExplosion = useSelector((state: RootState) => state.app.playerExplosion);
    const colors = {
        player: "white",
        empty: "red",
        hardWall: "black",
        softWall: "grey",
    };
    const cellSize = `calc((100vh - 10rem) / ${SIZE})`;
    // if (cell.explosion) console.log(cell.explosion);
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
            {cell.modifier && !playerExplosion && <div style={{ color: "pink", fontSize: "2rem" }}>{cell.modifier === "extraLength" ? "o" : cell.modifier === "extraSpeed" ? ">>" : "slow"}</div>}
        </div>
    );
};

export default Cell;
