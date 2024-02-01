import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { appActions } from "../store/AppSlice";
import { CellType, Direction, MatrixType } from "../types/types";
import { isNextPosInsideMatrix } from "../utility/utils";

const Bomb = ({ position }: { position: number[] }) => {
    const dispatch = useDispatch();
    const [count, setCount] = useState(3);
    const matrix = useSelector((state: RootState) => state.app.matrix);
    const playerPosition = useSelector((state: RootState) => state.app.playerPosition);
    const bombLength = useSelector((state: RootState) => state.app.bombLength);

    useEffect(() => {
        if (count > 0) {
            setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else if (count === 0) {
            let tmpMatrix: MatrixType = [];

            //initialize empty cells array with the position of the bomb
            const nextEmptyCells: { shape: "cross" | "horizontal" | "vertical"; coordinates: number[] }[] = [{ shape: "cross", coordinates: [position[0], position[1]] }];

            (["up", "down", "left", "right"] as Direction[]).forEach((direction) => {
                for (let index = 0; index < bombLength; index++) {
                    let row = position[0];
                    if (direction === "up") row = row - index;
                    if (direction === "down") row = row + index;
                    let col = position[1];
                    if (direction === "left") col = col - index;
                    if (direction === "right") col = col + index;
                    const isInside = [row, col].map((p: number) => isNextPosInsideMatrix(p));

                    if (isInside[0] && isInside[1] && !nextEmptyCells.find((cell) => cell.coordinates[0] === row && cell.coordinates[1] === col)) {
                        const status = matrix[row][col].status;
                        if (status === "hardWall") break;
                        if (status === "softWall") {
                            nextEmptyCells.push({
                                shape: row === position[0] && col === position[1] ? "cross" : direction === "up" || direction === "down" ? "vertical" : "horizontal",
                                coordinates: [row, col],
                            });
                            break;
                        } else if (status === "empty") {
                            nextEmptyCells.push({
                                shape: row === position[0] && col === position[1] ? "cross" : direction === "down" ? "vertical" : "horizontal",
                                coordinates: [row, col],
                            });
                        }
                    }
                }

                // update matrix with new empty cells
                tmpMatrix = matrix.map((row: CellType[], rowIndex: number) => {
                    return row.map((cell: CellType, cellIndex: number) => {
                        let newCell = { ...cell };
                        nextEmptyCells.map((emptyCell: { shape: "cross" | "horizontal" | "vertical"; coordinates: number[] }) => {
                            if (rowIndex === emptyCell.coordinates[0] && cellIndex === emptyCell.coordinates[1]) {
                                newCell = {
                                    ...cell,
                                    status: "empty",
                                    hasBomb: false,
                                    explosion: emptyCell.shape,
                                    modifier: { ...cell.modifier, action: cell.status === "empty" ? null : cell.modifier.action },
                                };
                            }
                        });
                        return newCell;
                    });
                }) as MatrixType;
            });

            dispatch(appActions.setMatrix(tmpMatrix));
            dispatch(appActions.setPlayerExplosion(true));
        }
    }, [count, dispatch, matrix, position, playerPosition, bombLength]);
    return <div style={{ color: "black", width: "100%", height: "100%", position: "absolute", display: "flex", justifyContent: "center", alignItems: "center" }}>{count}</div>;
};

export default Bomb;
