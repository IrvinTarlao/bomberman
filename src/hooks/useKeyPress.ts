import { useEffect, useState } from "react";

const useKeyPress = (targetKey: string, unique: boolean = false) => {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        if (keyPressed && unique) {
            setKeyPressed(false);
        }
    }, [keyPressed, unique]);

    useEffect(() => {
        const downHandler = ({ key }: { key: string }) => {
            if (key === targetKey) setKeyPressed(true);
        };

        const upHandler = ({ key }: { key: string }) => {
            if (key === targetKey) setKeyPressed(false);
        };

        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [targetKey]);

    return keyPressed;
};

export default useKeyPress;
