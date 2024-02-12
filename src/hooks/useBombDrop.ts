import { useEffect, useState } from "react";
import useKeyPress from "./useKeyPress";

const useBombDrop = () => {
    const [isBombDropped, setIsBombDropped] = useState<boolean>(false);

    const spaceBar = useKeyPress(" ", true);

    useEffect(() => {
        setIsBombDropped(!isBombDropped && spaceBar);
    }, [spaceBar, isBombDropped]);

    return isBombDropped;
};

export default useBombDrop;
