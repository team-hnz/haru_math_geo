
// export class Property<T, Tget, Tset> {
//     data: T;
//     getWrapper: ((data: T) => Tget) | null;
//     setWrapper: ((value: Tset) => T) | null;

//     constructor(data: T, getWrapper: null, setWrapper: null) {
//         this.data = ((setWrapper == null) ? data : setWrapper(data));
//         this.getWrapper = getWrapper;
//         this.setWrapper = setWrapper;
//     }

//     get = () => this.getWrapper(this.data);
//     set = (value: Tset) => this.data = this.setWrapper(value);
// }

export class COORD {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toArray = () => [this.x, this.y]
}