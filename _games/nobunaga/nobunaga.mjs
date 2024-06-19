import Game from '../assets/pmbase/game.mjs';

class Nobunaga extends Game {
  constructor() {
    super();

    this.sprite.add('busho_o', {
      url: '/nobunaga/images/busho_o.min.png',
      width: 64,
      height: 32,
      col: 10
    });
    this.sprite.add('busho_s', {
      url: '/nobunaga/images/busho_s.min.png',
      width: 31,
      height: 19,
      col: 10
    });
    this.sprite.add('pokemon', {
      url: '/nobunaga/images/pokemon.min.png',
      width: 32,
      height: 32,
      col: 10
    });
    this.sprite.add('kuni', {
      url: '/nobunaga/images/castle.min.png',
      width: 32,
      height: 40,
      col: 6
    });
    this.sprite.add('building', {
      url: '/nobunaga/images/shisetsu.min.png',
      width: 48,
      height: 48,
      col: 10
    });
  }
}

const statLimit = [
  [0, 190, 230, 270, 320, 1000],
  [0, 120, 170, 220, 270, 1000],
  [0, 100, 140, 180, 220, 1000],
  [0, 75, 125, 175, 225, 1000],
];

function getStatStar(stat, value) {
  return statLimit[stat].findIndex(x => x >= value);
}

const blColor = ['#000', '#569ed2', '#4292cd', '#3386c2', '#2e78ae', '#daa520'];

function getBestLinkText(value) {
  let stage = Math.floor(value / 20);
  return value == 0 ? '' : `<span style="color:${blColor[stage]};font-weight:bold;">${value}%</span>`;
}

export default new Nobunaga();