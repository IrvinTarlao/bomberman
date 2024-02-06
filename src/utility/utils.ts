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
    const matrix = updateMatrix({
        matrix: Array(SIZE).fill(Array(SIZE).fill({ status: "softWall", hasBomb: false, explosion: null, modifier: { action: null, id: null } })),
        playerPosition,
        init: true,
    });
    const modifiers: object[] = [];
    matrix.map((row) => row.map((cell) => cell.modifier.id !== null && modifiers.push(cell.modifier)));
    dispatch(appActions.setInitialState({ matrix, modifiers }));
};

export const updateMatrix = ({
    matrix,
    playerPosition,
    hasBomb = false,
    init = false,
    playerExplosionEnd = false,
    dispatch,
}: {
    matrix: MatrixType;
    playerPosition: number[];
    hasBomb?: boolean;
    init?: boolean;
    playerExplosionEnd?: boolean;
    dispatch?: Dispatch;
}) => {
    return matrix.map((row: CellType[], rowIndex: number) => {
        return row.map((cell: CellType, cellIndex: number) => {
            let newCell = { ...cell, modifier: init ? getRandomModifier() : cell.modifier }; // generate modifiers only on first mount

            //update player position
            if (rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) {
                newCell = { ...newCell, status: "player", hasBomb: hasBomb || cell.hasBomb };
            }

            //handle explosion
            if (newCell.explosion !== null) {
                if (rowIndex === playerPosition[0] && cellIndex === playerPosition[1] && dispatch) {
                    dispatch(appActions.setPlayerStatus("dead"));
                } else newCell = { ...newCell, explosion: playerExplosionEnd ? null : cell.explosion };
            }

            //handle modifiers catch
            if (cell.modifier.action && rowIndex === playerPosition[0] && cellIndex === playerPosition[1]) {
                newCell = { ...newCell, modifier: { action: null, id: null } };
            }

            // keep first cells always empty
            if ((rowIndex === 0 && (cellIndex === 0 || cellIndex === 1)) || (rowIndex === 1 && cellIndex === 0)) {
                newCell = { ...newCell, status: "empty", modifier: { action: null, id: null } };
            }
            // generate hardwalls
            if (rowIndex % 2 === 1 && cellIndex % 2 === 1) {
                newCell = { ...newCell, status: "hardWall", modifier: { action: null, id: null } };
            }

            rowIndex === playerPosition[0] && cellIndex === playerPosition[1] && console.log(playerPosition, [rowIndex, cellIndex]);
            return newCell;
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
    const extraBombModif = Array(50).fill("extraBomb");
    return { action: extraBombModif[random], id: extraBombModif[random] !== null ? id : null };
};

export const isNextPosInsideMatrix = (nextPosition: number) => nextPosition < downOrRightLimit && nextPosition >= upOrLeftLimit;
