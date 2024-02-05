import { useSelector } from "react-redux";
import { CellType } from "../types/types";
import Cell from "./Cell";
import { RootState } from "../store/store";

const Matrix = () => {
    const { matrix } = useSelector((state: RootState) => state.app);

    return matrix.map((row, rowIndex) => (
        <div style={{ display: "flex", flexDirection: "row" }} key={rowIndex}>
            {row.map((cell: CellType, cellIndex: number) => (
                <Cell cell={cell} key={rowIndex + cellIndex} position={[rowIndex, cellIndex]} />
            ))}
        </div>
    ));
};

export default Matrix;
