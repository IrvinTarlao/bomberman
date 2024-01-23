import { CellType } from "./Matrix";

const Cell = ({ cell }: { cell: CellType }) => {
    const colors = {
        player: "white",
        empty: "red",
        wall: "black",
        bomb: "yellow",
    };
    const style = { width: 100, height: 100, border: "1px solid white", backgroundColor: colors[cell] };
    return <div style={style}></div>;
};

export default Cell;
