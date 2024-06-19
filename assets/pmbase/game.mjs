import sprite from './sprite.mjs';
import database from './database.mjs';

class Game {
  sprite;
  database;

  constructor() {
    this.sprite = sprite;
    this.database = database;
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