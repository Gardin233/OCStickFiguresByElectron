import * as PIXI from "pixi.js";
export class Text {
    private TextObj: PIXI.Text;
    private content: string;
    private style: PIXI.TextStyle;
    constructor(stage:PIXI.Container,content: string, style: PIXI.TextStyle) {
        this.content = content;
        this.style = style;
        this.TextObj = new PIXI.Text(this.content, this.style);
        stage.addChild(this.TextObj);
    }
    getContent(): string {
        return this.content;
    }
    getStyle(): PIXI.TextStyle {
        return this.style;
    }
}