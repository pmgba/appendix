import Game from '../assets/pmbase/game.mjs';

class Quest extends Game {
  constructor() {
    super();
    
    this.sprite.add( 'pokemon', {
      url : '/quest/images/pokemon.min.png',
      width: 64,
      height:64,
      col: 10
    });
    this.sprite.add( 'skill', {
      url : '/quest/images/skills.min.png',
      width: 48,
      height:48,
      col: 10
    });
  }
  
  getTypes(types) {
    return [...new Set(types)]
      .map(t => this.data.get('typename', t))
      .join(' + ');
  }

}

export default new Quest();