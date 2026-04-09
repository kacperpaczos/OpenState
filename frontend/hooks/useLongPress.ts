import { useCallback, useRef, useState } from "react";

interface LongPressOptions {
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
    ms?: number;
}

export default function useLongPress({
    onLongPress,
    onClick,
    ms = 500,
}: LongPressOptions) {
    const [isLongPressActive, setIsLongPressActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressTriggered = useRef(false);

    const start = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            isLongPressTriggered.current = false;
            setIsLongPressActive(true);
            timerRef.current = setTimeout(() => {
                onLongPress(event);
                isLongPressTriggered.current = true;
            }, ms);
        },
        [onLongPress, ms]
    );

    const stop = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            setIsLongPressActive(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (!isLongPressTriggered.current && onClick) {
                onClick(event);
            }
        },
        [onClick]
    );

    return {
        onMouseDown: (e: React.MouseEvent) => start(e),
        onMouseUp: (e: React.MouseEvent) => stop(e),
        onMouseLeave: () => {
            setIsLongPressActive(false);
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        onTouchStart: (e: React.TouchEvent) => start(e),
        onTouchEnd: (e: React.TouchEvent) => stop(e),
        isLongPressActive,
    };
}
