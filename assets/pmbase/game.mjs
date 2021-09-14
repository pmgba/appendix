import sprite from './sprite.mjs';
import data from './data.mjs';

class Game {
  sprite;
  data;

  constructor() {
    this.sprite = sprite;
    this.data = data;
  }


  getNumber(number, length = 3) {
    return '#' + number.toString().padStart(length, '0');
  }

  getLink(module, query, text) {
    let href = '#!/' + module;
    if(query){
      href += '?' + new URLSearchParams(query).toString();
    }
    return `<a href="${href}">${text}</a>`;
  }

  getTypes(types) {

  }

}

export default Game;