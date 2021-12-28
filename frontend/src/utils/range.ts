/**
 * Представляет собой объект, хранящий промежуток фиксированной длины
 */
export default class RangeObject {
    first: number ;
    last: number;
    readonly size: number;

    constructor(size: number, origin?: number, first?: number, last?: number) {
        if (origin == undefined) {
            origin = 0;
        }

        if ((first == undefined) || (last == undefined)) {
            const range = Math.floor(size) / 2;
            this.first = origin-range;
            this.last = origin+range;
        } else {
            this.first = first;
            this.last = last;
        }

        this.size = size;
    }

    move(amount: number) {
        const range = new RangeObject(this.size, 0, this.first, this.last);

        if (amount > 0) {
            range.last += amount;
        } else {
            range.first += amount;
        }
        const offset = range.last - range.first - range.size;

        if (offset > 0) {
            if (amount > 0) {
                range.first += offset;
            } else {
                range.last -= offset;
            }
        }

        return {offset, range};
    }
}