import {ItemInterface} from "react-sortablejs";

export class SortableItem<T> implements ItemInterface{
    id: string;

    /** When true, the item is selected using MultiDrag */
    selected?: boolean;
    /** When true, the item is deemed "chosen", which basically just a mousedown event. */
    chosen?: boolean;
    /** When true, it will not be possible to pick this item up in the list. */
    filtered?: boolean;

    object: T;

    root: SortableArray<T>;
    constructor(root: SortableArray<T>, id: number, object: T) {
        this.id = root.prefix + ":" + id;
        this.object = object;
        this.root = root;
    }
}

function clone<T>(obj: T): T {
    const R : {[key: string]: any} = {};
    for (let key in obj) {
        R[key] = obj[key];
    }
    // @ts-ignore
    return R;
}

export default class SortableArray<T> {
    array: Array<SortableItem<T>>;
    prefix: string;
    field: string;

    onItemUpdate?: (item: T, newIndex: number) => void;
    onFieldUpdate?: (oldField: number, newField: number) => number;
    onArrayUpdate?: (array: Array<T>) => void;
    onRender?: (item: SortableItem<T>) => any;

    constructor(prefix: string, field: string, array: Array<T>, idBuilder?: (item: T, i: number) => string) {
        this.field = field;
        this.prefix = prefix;
        this.array = new Array<SortableItem<T>>();
        for (let i = 0; i < array.length; ++i) {
            // @ts-ignore
            this.array.push(new SortableItem<T>(this, idBuilder ? idBuilder(array[i], i) : array[i][field], array[i]));
        }
    }

    updateItem(item: SortableItem<T>, newIndex: number) {
        item.object = clone<T>(item.object)
        if (this.onFieldUpdate != undefined) {
            // @ts-ignore
            item.object[this.field] = this.onFieldUpdate(item.object[this.field], newIndex);
        } else {
            // @ts-ignore
            item.object[this.field] = newIndex
        }
        if (this.onItemUpdate != undefined) {
            this.onItemUpdate(item.object, newIndex);
        }
    }

    getSetter() {
        return (array: Array<SortableItem<T>>) => {
            const newArray = new Array<T>();

            if (this.array.length == array.length) {
                let noUpdate = true;

                for (let i = 0; i < array.length; ++i) {
                    if ((this.array[i].id != array[i].id) || (array[i].root != this)) {
                        if (array[i].root != this)
                            array[i].root = this;

                        noUpdate = false;

                        this.updateItem(array[i], i);
                    }
                    newArray.push(array[i].object);
                }

                if (noUpdate) return;
            } else if (this.array.length < array.length) {
                for (let i = 0; i < this.array.length; ++i) {
                    if ((this.array[i].id != array[i].id) || (array[i].root != this)) {
                        if (array[i].root != this)
                            array[i].root = this;

                        this.updateItem(array[i], i);
                    }
                    newArray.push(array[i].object);
                }

                this.updateItem(array[array.length - 1], array.length - 1);
                newArray.push(array[array.length - 1].object);
            } else {
                const set: {[keys: string]: SortableItem<T>} = {};
                for (let i = 0; i < array.length; ++i) {
                    set[array[i].id] = array[i];
                }

                for (let i = 0; i < array.length; ++i) {
                    if ((array[i].id in set) && ((this.array[i].id != array[i].id) || (array[i].root != this))) {
                        if (array[i].root != this)
                            array[i].root = this;

                        this.updateItem(array[i], i);
                    }
                    newArray.push(array[i].object);
                }

                const last = this.array[this.array.length - 1];
                if (last.id in set) {
                    this.updateItem(last, this.array.length - 1);
                    newArray.push(last.object);
                }
            }

            if (this.onArrayUpdate != undefined) this.onArrayUpdate(newArray);

            this.array = array;
        }
    }

    render(): any {
        if (this.onRender != undefined) {
            return this.array.map(this.onRender);
        }

        return undefined;
    }

}


