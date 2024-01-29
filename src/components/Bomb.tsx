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

    useEffect(() => {
        const bombLength = 3;
        if (count > 0) {
            setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else if (count === 0) {
            let tmpMatrix: MatrixType = [];

            //initialize empty cells array with the position of the bomb
            const nextEmptyCells: number[][] = [[position[0], position[1]]];

            (["up", "down", "left", "right"] as Direction[]).forEach((direction) => {
                const nextEmptyPositions: number[][] = [];
                // get coordinates of cells that will go empty after bomb has exploded
                for (let index = 0; index < bombLength - 1; index++) {
                    const row = position[0] + (direction === "up" ? index - 1 : direction === "down" ? index : 0);
                    const col = position[1] + (direction === "left" ? index - 1 : direction === "right" ? index : 0);
                    const pos = [row, col];
                    nextEmptyPositions.push(getNextPositions(direction, pos));
                }
                // check if coordinates of future empty cells are inside the matrix and if there are hardWalls that can't be detroyed
                for (let index = 0; index < nextEmptyPositions.length; index++) {
                    const position = nextEmptyPositions[index];
                    const isInside = isNextPosInsideMatrix(direction, position[direction === "up" || direction === "down" ? 0 : 1]);
                    if (isInside) {
                        const status = matrix[position[0]][position[1]].status;
                        if (status === "hardWall") break;
                        else nextEmptyCells.push(position);
                    }
                }
                // update matrix with new empty cells
                tmpMatrix = matrix.map((row: CellType[], rowIndex: number) => {
                    return row.map((cell: CellType, cellIndex: number) => {
                        let newCell = { ...cell };
                        nextEmptyCells.map((emptyCell: number[]) => {
                            if (emptyCell[0] === playerPosition[0] && emptyCell[1] === playerPosition[1]) dispatch(appActions.setPlayerStatus("dead"));
                            else if (rowIndex === emptyCell[0] && cellIndex === emptyCell[1]) {
                                newCell = { ...cell, status: "empty", hasBomb: false };
                            }
                        });
                        return newCell;
                    });
                }) as MatrixType;
            });
            dispatch(appActions.setMatrix(tmpMatrix));
        }
    }, [count, dispatch, matrix, position, playerPosition]);
    return <div style={{ color: "black", border: "2px solid black" }}>{count}</div>;
};

export default Bomb;
