import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { appActions } from "../store/AppSlice";
import { CellType, Direction, MatrixType } from "../types/types";
import { getNextPositions, isNextPosInsideMatrix } from "../utility/utils";

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
                const nextEmptyPositions: number[][] = [];
                // get coordinates of cells that will go empty after bomb has exploded
                for (let index = 0; index < bombLength; index++) {
                    const row = position[0] + (direction === "up" ? index - 1 : direction === "down" ? index : 0);
                    const col = position[1] + (direction === "left" ? index - 1 : direction === "right" ? index : 0);
                    const pos = [row, col];
                    nextEmptyPositions.push(getNextPositions(direction, pos));
                }
                // check if coordinates of future empty cells are inside the matrix and if there are hardWalls that can't be detroyed
                for (let index = 0; index < nextEmptyPositions.length; index++) {
                    const coordinates = nextEmptyPositions[index];
                    const isInside = isNextPosInsideMatrix(direction, coordinates[direction === "up" || direction === "down" ? 0 : 1]);
                    if (isInside) {
                        const status = matrix[coordinates[0]][coordinates[1]].status;
                        if (status === "hardWall") break;
                        else
                            nextEmptyCells.push({
                                shape: coordinates[0] === position[0] && coordinates[1] === position[1] ? "cross" : direction === "up" || direction === "down" ? "vertical" : "horizontal",
                                coordinates,
                            });
                    }
                }
                // update matrix with new empty cells
                tmpMatrix = matrix.map((row: CellType[], rowIndex: number) => {
                    return row.map((cell: CellType, cellIndex: number) => {
                        let newCell = { ...cell };
                        nextEmptyCells.map((emptyCell: { shape: "cross" | "horizontal" | "vertical"; coordinates: number[] }, index: number) => {
                            if (rowIndex === emptyCell.coordinates[0] && cellIndex === emptyCell.coordinates[1]) {
                                newCell = { ...cell, status: "empty", hasBomb: false, explosion: emptyCell.shape, modifier: index === 7 ? "extraLength" : null };
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
