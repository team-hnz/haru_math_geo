import { renderToStaticMarkup } from "react-dom/server"

export function createElementFromHTML(htmlString: string): ChildNode | null {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    return div.firstChild;
}

export function createElementFromJSX(jsx: JSX.Element): ChildNode | null {
    return createElementFromHTML(renderToStaticMarkup(jsx));
}