import { useEffect, useState } from "react";

const Bomb = () => {
    const [count, setCount] = useState(3);
    useEffect(() => {
        if (count > 0) {
            setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        }
    }, [count]);
    return <div style={{ color: "black", border: "2px solid black" }}>{count}</div>;
};

export default Bomb;
