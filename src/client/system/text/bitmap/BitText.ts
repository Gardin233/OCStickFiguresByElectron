import * as PIXI from "pixi.js";
export class BitText {
    private TextObj: PIXI.BitmapText;
    private content: string;
    private style: PIXI.IBitmapTextStyle
    constructor(stage:PIXI.Container,content: string, style: PIXI.IBitmapTextStyle) {
        this.content = content;
        this.style = style;
        this.TextObj = new PIXI.BitmapText(this.content, this.style);
        stage.addChild(this.TextObj);

    }
}