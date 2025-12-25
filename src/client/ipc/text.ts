import { Text } from "../system/text/common/Text.js";

export class TextIPC {
 public textList:Map<string, Text>;
    constructor() {
        this.textList = new Map<string, Text>();
    }
}