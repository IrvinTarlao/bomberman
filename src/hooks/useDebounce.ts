import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";

const useDebounce = (callback: () => void, time = 1000): (() => void) => {
    const ref = useRef<() => void>();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, time);
    }, [time]);

    return debouncedCallback;
};
export { useDebounce };
