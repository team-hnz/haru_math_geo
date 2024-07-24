import { useRef, useEffect, RefObject } from "react";

export const useCanvas = (
    width: number,
    height: number,
    draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void
) => {
    const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        const setCanvas = () => {
            const devicePixelRatio: number = window.devicePixelRatio || 1;

            if (canvas && ctx) {
                canvas.width = width * devicePixelRatio;
                canvas.height = height * devicePixelRatio;
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;

                ctx.scale(devicePixelRatio, devicePixelRatio);
            }
        };
        setCanvas();

        if (ctx) draw(ctx, 0);
    }, [width, height]);

    return canvasRef;
}