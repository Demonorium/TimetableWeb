
export interface Dims {
    width: number;
    height: number;
}
export interface Pos {
    x: number;
    y: number;
}
export interface Scrolls extends Pos{
    vsize: number;
    hsize: number;
}

/**
 * Получить размеры HTML объекта по рефу на него
 * @param containerRef ссылка на объект
 */
export function getDimensions(containerRef: any): Dims {
    if (containerRef.current == null) {
        return {width: 0, height: 0}
    }
    const { width, height } = containerRef.current.getBoundingClientRect();

    return {
        width, height
    };
}

/**
 * Получить положение HTML объекта по рефу на него
 * @param containerRef ссылка на объект
 */
export function getPos(containerRef: any): Pos {
    if (containerRef.current == null) {
        return {x: 0, y: 0}
    }
    const { x, y } = containerRef.current.getBoundingClientRect();

    return {
        x, y
    };
}

/**
 * Получить положение скрола HTML объекта по рефу на него
 * @param containerRef ссылка на объект
 */
export function getScrollState(containerRef: any): Scrolls {
    if (containerRef.current == null) {
        return {x: 0, y: 0, vsize: 0, hsize: 0}
    }

    return {
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop,
        vsize: containerRef.current.scrollHeight,
        hsize: containerRef.current.scrollWidth
    }
}

/**
 * Получить информации о положение, размерах и состоянии скрола HTML объекта по рефу на него
 * @param containerRef ссылка на объект
 */
export default function getComponentInfo(containerRef: any) {
    return {pos: getPos(containerRef), dims: getDimensions(containerRef), scrolls: getScrollState(containerRef)};
}
