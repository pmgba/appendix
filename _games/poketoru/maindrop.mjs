import poketoru from './poketoru.mjs';
import stageloader from './stageloader.mjs';

function createArea(areaIndex) {
  let list = [];
  for (let i = 1; i <= 700; i++) {
    let stage = stageloader.getStage('main', i);
    let drop = stage.getDrops(true).find(x=>x.type==32)?.prob;
    if(!drop) continue;
    let pokemon = stage.getPokemon();

    list.push([
      i,
      `<a href="#!/pokemon?id=${pokemon.id}">${pokemon.getSprite(24)}</a>`,
      `<a href="#!/mainstage?id=${i}">${pokemon.name}</a>`,
      poketoru.getType(pokemon.type),
      (drop).toFixed(2),
    ]);
  }

  let html = ``;

  html += databook.component.create({
    type: 'list',
    columns: [{
      text: '编号',
    }, {
      text: '图标',
    }, {
      text: '宝可梦',
    }, {
      text: '属性',
    }, {
      text: '掉落',
    }],
    list: list,
    hover: false,
    card: true,
  });

  return {
    subtitle: `${name}`,
    content: html,
    breadcrumb: [{
      level: 1,
      text: '主线关卡',
      link: '#!/mainstage',
    }],
  };

}

export default {

  title: "主线关卡",

  async init() {
    await poketoru.init('pokemon', 'ability', 'item');
    await stageloader.init('main');
  },

  getContent: (search) => {
      return createArea();
  },
};
