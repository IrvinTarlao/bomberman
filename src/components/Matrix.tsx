import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CellType } from "../types/types";
import { RootState } from "../store/store";
import { appActions } from "../store/AppSlice";

import Cell from "./Cell";
import useUpdatedMatrix from "../hooks/useUpdatedMatrix";

const Matrix = () => {
    const dispatch = useDispatch();

    const matrix = useSelector((state: RootState) => state.app.matrix);

    const updatedMatrix = useUpdatedMatrix();

    useEffect(() => {
        updatedMatrix && dispatch(appActions.setMatrix(updatedMatrix));
    }, [dispatch, updatedMatrix]);

    return matrix.map((row, rowIndex) => (
        <div style={{ display: "flex", flexDirection: "row" }} key={rowIndex}>
            {row.map((cell: CellType, cellIndex: number) => (
                <Cell cell={cell} key={rowIndex + cellIndex} position={[rowIndex, cellIndex]} />
            ))}
        </div>
    ));
};

export default Matrix;
