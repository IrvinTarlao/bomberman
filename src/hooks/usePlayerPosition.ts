import { useEffect, useState } from "react";
import { CellType, Direction } from "../types/types";
import { isNextPosInsideMatrix } from "../utility/utils";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { downOrRightLimit, upOrLeftLimit } from "../config/constants";
import useKeyPress from "./useKeyPress";

const usePlayerPosition = () => {
    const matrix = useSelector((state: RootState) => state.app.matrix);
    const { playerPosition, speed } = useSelector((state: RootState) => state.playerOne);

    const [positions, setPositions] = useState<number[]>(playerPosition);

    const arrowUp = useKeyPress("ArrowUp");
    const arrowDown = useKeyPress("ArrowDown");
    const arrowLeft = useKeyPress("ArrowLeft");
    const arrowRight = useKeyPress("ArrowRight");

    useEffect(() => {
        const isWall = (cell: CellType) => cell.status === "hardWall" || cell.status === "softWall";

        const getNextPositions = (direction: Direction, position: number[]) => {
            let res: number[] = [];
            if (direction === "down") res = [position[0] + 1, position[1]];
            if (direction === "up") res = [position[0] - 1, position[1]];
            if (direction === "left") res = [position[0], position[1] - 1];
            if (direction === "right") res = [position[0], position[1] + 1];
            return res;
        };

        const getNextPosition = ({ currentPosition, nextPosition, limit, direction }: { currentPosition: number; nextPosition: number; limit: number; direction: Direction }) => {
            const [rowPos, colPos] = getNextPositions(direction, playerPosition);
            return isNextPosInsideMatrix(nextPosition) ? (isWall(matrix[rowPos][colPos]) ? currentPosition : nextPosition) : limit;
        };

        const timeoutDown = setTimeout(() => {
            const nextRowPos = getNextPosition({ currentPosition: playerPosition[0], nextPosition: playerPosition[0] + 1, limit: downOrRightLimit, direction: "down" });
            setPositions([nextRowPos, playerPosition[1]]);
        }, speed);

        const timeoutUp = setTimeout(() => {
            const nextRowPos = getNextPosition({ currentPosition: playerPosition[0], nextPosition: playerPosition[0] - 1, limit: upOrLeftLimit, direction: "up" });
            setPositions([nextRowPos, playerPosition[1]]);
        }, speed);

        const timeoutLeft = setTimeout(() => {
            const nextColPos = getNextPosition({ currentPosition: playerPosition[1], nextPosition: playerPosition[1] - 1, limit: upOrLeftLimit, direction: "left" });
            setPositions([playerPosition[0], nextColPos]);
        }, speed);
        const timeoutRight = setTimeout(() => {
            const nextColPos = getNextPosition({ currentPosition: playerPosition[1], nextPosition: playerPosition[1] + 1, limit: downOrRightLimit, direction: "right" });
            setPositions([playerPosition[0], nextColPos]);
        }, speed);

        arrowDown ? timeoutDown : clearTimeout(timeoutDown);
        arrowUp ? timeoutUp : clearTimeout(timeoutUp);
        arrowLeft ? timeoutLeft : clearTimeout(timeoutLeft);
        arrowRight ? timeoutRight : clearTimeout(timeoutRight);
    }, [arrowDown, arrowUp, arrowRight, arrowLeft, playerPosition, speed, matrix]);

    return positions;
};

export default usePlayerPosition;
