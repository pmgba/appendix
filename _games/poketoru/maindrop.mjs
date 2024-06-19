import poketoru from './poketoru.mjs';
import stageloader from './stageloader.mjs';

await poketoru.init('pokemon', 'ability', 'item');
await stageloader.init('main');

function createContent() {
  const list = [];
  for (let i = 1; i <= 700; i++) {
    const stage = stageloader.getStage('main', i);
    const drop = stage.getDrops(true).find(x=>x.type == 32)?.prob;
    if(!drop) {continue;}
    const pokemon = stage.getPokemon();

    list.push([
      i,
      `<a href="#!/pokemon?id=${pokemon.id}">${pokemon.getSprite(24)}</a>`,
      `<a href="#!/mainstage?id=${i}">${pokemon.fullname}</a>`,
      poketoru.getType(pokemon.type),
      (drop).toFixed(2),
    ]);
  }

  let html = ``;

  html += databook.component.create({
    type: 'list',
    columns: [{
      text: '关卡编号',
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
    card: true,
  });

  return {
    content: html
  };

}

export default {

  title: "主线掉落",

  content: createContent,
};
