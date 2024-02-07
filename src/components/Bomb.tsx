import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { appActions } from "../store/AppSlice";
import { CellInBombRadius, Direction, MatrixType } from "../types/types";
import { isNextPosInsideMatrix, updateMatrix } from "../utility/utils";
import { playerOneActions } from "../store/PlayerOneSlice";

const Bomb = ({ position }: { position: number[] }) => {
    const dispatch = useDispatch();
    const [count, setCount] = useState(3); //countdown => bomb explodes at 0
    const matrix = useSelector((state: RootState) => state.app.matrix);
    const { playerPosition, bombLength } = useSelector((state: RootState) => state.playerOne);

    const bombStyle = { color: "black", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" };

    useEffect(() => {
        if (count > 0) {
            setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else if (count === 0) {
            let newMatrix: MatrixType = [];

            const getBombRadius = () => {
                const bombRadius: CellInBombRadius[] = [{ shape: "cross", coordinates: [position[0], position[1]] }];

                //determine which cells will be empty after bomb explosion
                (["up", "down", "left", "right"] as Direction[]).forEach((direction) => {
                    for (let index = 0; index < bombLength; index++) {
                        let row = position[0];
                        if (direction === "up") row = row - index;
                        if (direction === "down") row = row + index;
                        let col = position[1];
                        if (direction === "left") col = col - index;
                        if (direction === "right") col = col + index;

                        const isInside = [row, col].map((p: number) => isNextPosInsideMatrix(p));

                        if (isInside[0] && isInside[1] && !bombRadius.find((cell) => cell.coordinates[0] === row && cell.coordinates[1] === col)) {
                            const status = matrix[row][col].status;
                            if (status === "hardWall") break;
                            else {
                                bombRadius.push({
                                    shape: row === position[0] && col === position[1] ? "cross" : direction === "up" || direction === "down" ? "vertical" : "horizontal",
                                    coordinates: [row, col],
                                });
                                if (status === "softWall") break;
                            }
                        }
                    }
                });

                return bombRadius;
            };

            //positions of cells that will be empty after bomb explosion
            const bombRadius = getBombRadius();

            // update matrix with new empty cells
            newMatrix = updateMatrix({ matrix, playerPosition, bombRadius });

            //update states
            dispatch(appActions.setMatrix(newMatrix));
            dispatch(playerOneActions.setPlayerExplosion(true));
            dispatch(playerOneActions.setNbOfBombsPlayed(0));
        }
    }, [count, dispatch, matrix, position, playerPosition, bombLength]);

    return <div style={bombStyle}>{count}</div>;
};

export default Bomb;
