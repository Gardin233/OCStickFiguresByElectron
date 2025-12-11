import { ICONS } from "../../renderer.js";
import { SpineCharacter } from "../character/SpineCharacter.js";
//鼠标移动
export function MouseMoveEvent(character:SpineCharacter){
      window.electronAPI.onGlobalMouseMove(pos => {
    // console.log('mouse move', pos);
    let closedBB = character.hitChecker.getClosestBoundingBox(pos.x, pos.y);
    if (character.animator.state!=='holdHead'&&closedBB.name==="Head"&&closedBB.distance<20) {
        character.animator.holdHead();
      }
  });
}
//鼠标按下
export function MouseDownEvent(character:SpineCharacter){
     window.electronAPI.onGlobalMouseDown(info => {
    character.hitChecker.getHitBoundingBox(info.x, info.y);
    console.log("closed bb",character.hitChecker.getClosestBoundingBox(info.x, info.y))
    console.log('mouse down', info);
  });
}
//鼠标抬起
export function MouseUPEvent(character:SpineCharacter){
    window.electronAPI.onGlobalMouseUp(data=>{
        console.log(data)
  })
}
//键盘按下
export function KeyBoardDownEvent(character:SpineCharacter){
 window.electronAPI.onGlobalKeyDown(ev => {
    console.log('key down', ev.keycode, ev.ctrl, ev.alt, ev.shift);
    const pos =character.mover.getPosition()
    switch(ev.keycode) {
      case 30: // A:
        character.animator.walk(true);
        character.mover.moveTo(pos.x-50,pos.y)
        break;
      case 32: // D:
        character.animator.walk(false);
        character.mover.moveTo(pos.x+50,pos.y)
        break;
      case 17: // W:
        character.animator.jump();
        character.mover.moveTo(pos.x,pos.y-100)
        break;
      case 31: //S:
        break
      case 18: // E:
        console.log(ICONS)
        // character.animator.openDeskTopIcon(ICONS[0].target);
        break;
      case 33: // F:
          character.animator.lookAround();
          window.electronAPI.changeScreenFilter("OPPOSITE")
          break;
    }
  });
}
//按键抬起
export function KeyBoardUpEvent(character:SpineCharacter){
    window.electronAPI.onGlobalKeyUp(ev=>{
        console.log(ev)
   })
    
}