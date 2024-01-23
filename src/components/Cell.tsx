const Cell = ({ cell }: { cell: "empty" | "player" }) => {
    const style = { width: 100, height: 100, border: "1px solid white", backgroundColor: cell === "player" ? "white" : "red" };
    return <div style={style}></div>;
};

export default Cell;
