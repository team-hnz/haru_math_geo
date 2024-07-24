import React, { CSSProperties } from "react";
import useScript from "../hooks/useScript.tsx";
import useLink from "../hooks/useLink.tsx";
import { COORD } from "../../types/util/DataUtil.tsx";

let onJSXGraphLoaded: (() => void)[] = [];

export const JSXGraphLib = () => {
    
    useLink("https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css", "stylesheet", "text/css");
    useScript("https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js", false, () => onJSXGraphLoaded.forEach((f) => f()));
    // useScript("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js");
    return <></>;
}

export const JSXGraphCanvas = ( {id, style}: {id: string, style?: CSSProperties | undefined} ) => { return <div id={id} className="jxgbox" style={style} />; }

interface JSXStyle {}

interface JSXPointStyle extends JSXStyle {
    color?: string | undefined;
}

interface JSXLineStyle extends JSXStyle {
    straightFirst?: boolean | undefined;
    straightLast?: boolean | undefined;
}

interface JSXAngleStyle extends JSXStyle {

}

function styleMap<T>(name: string, defaultStyle: T, style: T): Object {
    return Object.assign({name: name}, defaultStyle, style);
}

interface JSXObject {
    getObject: () => any;
    setAttribute: (style: JSXStyle) => void;
}


class JSXPoint implements JSXObject {

    jsxobj: any;
    constructor(jsxobj: any) {
        this.jsxobj = jsxobj;
    }

    getObject: () => any = () => this.jsxobj;
    setAttribute: (style: JSXPointStyle) => void = style => this.jsxobj.setAttribute(style);
}

class JSXLine implements JSXObject {

    jsxobj: any;
    constructor(jsxobj: any) {
        this.jsxobj = jsxobj;
    }

    getObject: () => any = () => this.jsxobj;
    setAttribute: (style: JSXLineStyle) => void = style => this.jsxobj.setAttribute(style);
}

class JSXAngle implements JSXObject {

    jsxobj: any;
    constructor(jsxobj: any) {
        this.jsxobj = jsxobj;
    }

    getObject: () => any = () => this.jsxobj;
    setAttribute: (style: JSXAngleStyle) => void = style => this.jsxobj.setAttribute(style);
}

function getJSXObjectClass(typename: string) {
    switch (typename) {
        case "point": return JSXPoint;
        case "line": return JSXLine;
        case "angle": return JSXAngle;
        default: return null;
    }
}

export class JSXGraph {
    private readonly id: string;

    private board: any = undefined;
    private typeDict: { [x: string]: string[] };
    private itemDict: { [x: string]: JSXObject; };

    private onCanvasReady: (() => void)[]
    constructor(id: string) {
        this.id = id;

        this.itemPoints = [];
        this.typeDict = {
            "point": [],
            "line": [],
            "angle": [],
        };
        this.itemDict = {};

        this.onCanvasReady = [];

        if (window.JXG) this.init();
        else onJSXGraphLoaded.push(this.init);
    }
    init = () => {
        var canvasDiv = document.getElementById(this.id);
        if (!canvasDiv) { console.warn("Failed to find canvas. Retry..."); setTimeout(this.init, 100); return; }
        canvasDiv.innerHTML = "";
        this.board = window.JXG.JSXGraph.initBoard(this.id, {boundingbox: [-8, 8, 8, -8]});
        this.onCanvasReady.forEach(f => f())

        window.g = this;
    }
    private execute = (fn: () => void) => {
        if (this.board) { fn(); return; }
        if (window.JXG) { this.onCanvasReady.push(fn); }
        onJSXGraphLoaded.push(fn);
    }

    private get = (id: string) => this.itemDict[id];

    private create = (type: string, id: string, position, defaultStyle, style) => {
        this.execute(() => {
            var classobj = getJSXObjectClass(type);
            if (classobj == null) { console.error("Failed to find jsx element " + type); return; }

            var item  = this.board.create(type, position, styleMap(id, defaultStyle, style));
            var obj = new classobj(item);
            this.itemDict[id] = obj;
            this.typeDict[type].push(id)
        });
    }

    require = (idList: string[], callback: (...args: string[]) => void) => {
        for (var id of idList) {
            if (!this.itemDict[id]) {
                setTimeout(() => this.require(idList, callback));
                return;
            }
        }
        console.log(idList.map(x => this.itemDict[x]))
        callback(...idList.map(x => this.itemDict[x].getObject()))

    }

    // createPoint = (id: string, position: COORD, style: JSXPointStyle = {}) => this.itemDict[id] = this.create('point', id, position.toArray(), {}, style)
    // createLine = (id: string, p1: string, p2: string, style: JSXLineStyle = {}) => {
    //     this.create('line', id, [p1, p2], { straightFirst: false, straightLast: false }, style)
    // }
    // createAngle = (id: string, p1: string, p2: string, p3: string, style: JSXAngleStyle = {}) => this.create('angle', id, [p1, p2, p3], {}, style)

    createPoint = (id: string, position: COORD, style: JSXPointStyle = {}) => {
        this.execute(() => {
            var item = this.board.create('point', position.toArray(), styleMap(id, {}, style));
            this.itemDict[id] = new JSXPoint(item);
            this.typeDict['point'].push(id);
        });
    }
    createLine = (id: string, p1: string, p2: string, style: JSXLineStyle = {}) =>
        this.require(
            [p1, p2],
            (...objList) => this.create('line', id, objList, { straightFirst: false, straightLast: false }, style)
        )
    createAngle = (id: string, p1: string, p2: string, p3: string, style: JSXAngleStyle = {}) => 
        this.require(
            [p1, p2, p3],
            (...objList) => this.create('angle', id, objList, {}, style)
        )

}

// const useJSXGraph = (id: string) => {
//     useEffect(() => {
//         var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-8, 8, 8, -8]});
//         var p = board.create('point', [1, 3], {name: 'point'});
//     }, [id]);
// };