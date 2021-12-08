/**
 * Проверяет 2 массава на равенство ссылок и содержимого
 * @param l1 массив 1
 * @param l2 массив 2
 */
export function arrayEq(l1?: Array<any>, l2?: Array<any>) {
    if (l1 == l2)
        return true;
    if (((l1 == undefined) || (l2 == undefined)) && ((l1 != undefined) || (l2 != undefined)))
        return false;

    //l1 и l2 определены, в противном случае условия выше выполнятся, компилятор не смог распознать
    //поэтому ошибки тайпскрипта подавлены

    // @ts-ignore
    if (l1.length != l2.length)
        return false;

    // @ts-ignore
    for (let i = 0; i < l1.length; ++i) {
        // @ts-ignore
        if (l1[i] !== l2[i])
            return false;
    }
    return true;
}

export function updateElement<T>(array: Array<T>, element: T, comparator:(el1: T, el2: T) => boolean) {
    for (let i = 0; i < array.length; ++i) {
        if (comparator(array[i], element)) {
            array[i] = element;
        }
    }
}

export function replaceElement<T>(array: Array<T>, element: T, comparator:(el1: T, el2: T) => boolean): Array<T> {
    const newArray = new Array<T>();

    for (let i = 0; i < array.length; ++i) {
        if (comparator(array[i], element)) {
            newArray.push(element);
        } else {
            newArray.push(array[i]);
        }
    }

    return newArray;
}

export function replaceElementIndex<T>(array: Array<T>, element: T, index: number): Array<T> {
    const newArray = new Array<T>();

    for (let i = 0; i < array.length; ++i) {
        if (i == index) {
            newArray.push(element);
        } else {
            newArray.push(array[i]);
        }
    }

    return newArray;
}
export function removeElement<T>(array: Array<T>, element: T, comparator:(el1: T, el2: T) => boolean) {
    const newArray = new Array<T>();
    for (let i = 0; i < array.length; ++i) {
        if (comparator(array[i], element)) {
            continue;
        }
        newArray.push(array[i]);
    }
    return newArray;
}

export function removeElementComp<T>(array: Array<T>,  search:(el: T) => boolean) {
    const newArray = new Array<T>();
    for (let i = 0; i < array.length; ++i) {
        if (search(array[i])) {
            continue;
        }
        newArray.push(array[i]);
    }
    return newArray;
}

export function _addElement<T>(array: Array<T>, element: T) {
    const newArray = new Array<T>();
    for (let i = 0; i < array.length; ++i) {
        newArray.push(array[i]);
    }
    newArray.push(element);
    return newArray;
}

export function addElement<T>(array: Array<T>, element?: T, index?: number) {
    if (element == undefined) {
        const newArray = new Array<T>();
        for (let i = 0; i < array.length; ++i) {
            newArray.push(array[i]);
        }
        return newArray;
    }


    if ((index == undefined) || (index >= array.length)) {
        return _addElement(array, element);
    } else {
        const newArray = new Array<T>();

        for (let i = 0; i < array.length; ++i) {
            if (i == index) {
                newArray.push(element);
                newArray.push(array[i]);
            } else {
                newArray.push(array[i]);
            }
        }

        return newArray;
    }
}

export function findElement<T>(array: Array<T>, search: (element: T) => boolean): T | undefined {
    for (let i = 0; i < array.length; ++i) {
        if (search(array[i]))
            return array[i];
    }
    return undefined;
}

export function containsElement<T>(array: Array<T>, search: (element: T) => boolean): boolean {
    for (let i = 0; i < array.length; ++i) {
        if (search(array[i]))
            return true;
    }
    return false;
}