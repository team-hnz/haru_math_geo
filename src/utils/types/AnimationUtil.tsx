import "../../css/Animation.css";

export class AnimationData {
    type: string;
    target: Element;
    duraction: number;
    group: string;

    constructor(type: string, target: Element, duraction: number, group: string = "") {
        this.type = type;
        this.target = target;
        this.duraction = duraction;
        this.group = group;
    }
    
    stopfn = () => { // Use Arrow Function for this binding
        const group = GetAnimationGroup(this.group);
        const index = group.findIndex((value, index) => value.data === this);
        if (index >= 0) group.splice(index, 1);

        this.target.classList.remove(this.type);
    
    }
}

class AnimationPlayData {
    data: AnimationData;
    timeout: NodeJS.Timeout;

    constructor(data: AnimationData, timeout: NodeJS.Timeout) {
        this.data = data;
        this.timeout = timeout;
    }

    stopearly() {
        clearTimeout(this.timeout);
        this.data.stopfn();
    }
}


let AnimationStorage: { [s: string]: Array<AnimationPlayData>; } = {"": []}


export function GetAnimationGroup(group: string): Array<AnimationPlayData> { 
    if (group in AnimationStorage) return AnimationStorage[group];
    AnimationStorage[group] = [];
    return AnimationStorage[group];
}

/**
 * @param {AnimationData} data 
 * @returns {void}
 */
export function Animate(data: AnimationData): void {
    data.target.classList.add(data.type);
    var timeout = setTimeout(data.stopfn, data.duraction);
    GetAnimationGroup(data.group).push(new AnimationPlayData(data, timeout));
}
