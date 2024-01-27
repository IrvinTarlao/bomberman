import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { appActions } from "../store/AppSlice";
// import { updateMatrix } from "../utility/utils";
import { MatrixType } from "../types/types";

const Bomb = ({ position }: { position: number[] }) => {
    const dispatch = useDispatch();
    const [count, setCount] = useState(3);
    const matrix = useSelector((state: RootState) => state.app.matrix);

    useEffect(() => {
        if (count > 0) {
            setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else if (count === 0) {
            const bombToEmpty = (matrix: MatrixType, rowNumber: number, colNumber: number) => {
                const newMatrix = [...matrix];
                const targetRow = [...newMatrix[rowNumber]];
                targetRow[colNumber] = { status: "empty", hasBomb: false };
                newMatrix[rowNumber] = targetRow;
                return newMatrix;
            };
            const matrixAfterExplosion = bombToEmpty(matrix, position[0], position[1]);
            // const newMatrix = updateMatrix({ matrix, playerPosition: position, hasBomb: false });
            dispatch(appActions.setMatrix(matrixAfterExplosion));
        }
    }, [count, dispatch, matrix, position]);
    return <div style={{ color: "black", border: "2px solid black" }}>{count}</div>;
};

export default Bomb;
