import { Dispatch } from "@reduxjs/toolkit";
import { appActions } from "../store/AppSlice";
import { CellType, MatrixType } from "../types/types";
import { v4 as uuidv4 } from "uuid";

export const HEIGHT = "calc(100vh - 10rem)";
export const SIZE = 11;
export const downOrRightLimit = SIZE - 1;
export const upOrLeftLimit = 0;

export const getInitialMatrix = (dispatch: Dispatch) => {
    const playerPosition = [0, 0];
    const initialMatrix = updateMatrix({ matrix: Array(SIZE).fill(Array(SIZE).fill({ status: "softWall", hasBomb: false, modifier: { action: null, id: null } })), playerPosition, init: true });
    const modifiers: object[] = [];
    initialMatrix.map((row) => row.map((cell) => cell.modifier.id !== null && modifiers.push(cell.modifier)));
    dispatch(appActions.setMatrix(initialMatrix));
    dispatch(appActions.setPlayerPosition(playerPosition));
    dispatch(appActions.setPlayerStatus("alive"));
    dispatch(appActions.setModifiers(modifiers));
};

export const updateMatrix = ({ matrix, playerPosition, hasBomb = false, init = false }: { matrix: MatrixType; playerPosition: number[]; hasBomb?: boolean; init?: boolean }) => {
    return matrix.map((row: CellType[], rowIndex: number) => {
        return row.map((cell: CellType, cellIndex: number) => {
            //update player position
            if (rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) return { ...cell, status: "player", hasBomb: hasBomb || cell.hasBomb };
            else {
                // keep first cells empty for initial map
                if ((rowIndex === 0 && (cellIndex === 0 || cellIndex === 1)) || (rowIndex === 1 && cellIndex === 0) || cell.status === "player") return { ...cell, status: "empty" };
                // generate walls
                if (rowIndex % 2 === 1 && cellIndex % 2 === 1) return { ...cell, status: "hardWall", modifier: { action: null, id: null } };
                else return { ...cell, modifier: init ? getRandomModifier() : cell.modifier };
            }
        });
    }) as MatrixType;
};

export const getRandomModifier = () => {
    const id = uuidv4();
    const blankModifiers = Array(16).fill(null);
    const extraLengthModifiers = Array(3).fill("extraLength");
    const extraBombModifiers = Array(3).fill("extraBomb");
    const extraSpeedModifiers = Array(2).fill("extraSpeed");
    const lowerSpeedModifiers = Array(1).fill("lowerSpeed");
    const modifiers: CellType["modifier"][] = [...blankModifiers, ...extraBombModifiers, ...extraSpeedModifiers, ...extraLengthModifiers, ...lowerSpeedModifiers];
    const random = Math.floor(Math.random() * modifiers.length);
    return { action: modifiers[random], id: modifiers[random] !== null ? id : null };
};

export const isNextPosInsideMatrix = (nextPosition: number) => nextPosition < downOrRightLimit && nextPosition >= upOrLeftLimit;
