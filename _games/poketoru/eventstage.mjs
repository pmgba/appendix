import poketoru from './poketoru.mjs';
import stage from './stage.mjs';

function getStageList() {
  let stages = poketoru.data.get('StageData');
  let options = stages.map((stageData, i) => {
    let pokemon = poketoru.pokemon[stageData.PokemonId];
    return [
      i,
      `${i + 1} ${pokemon.name}`
    ];
  });
  return options;
}

function createMainPage() {
  let stages = poketoru.data.get('StageData');
  let list = databook.component.create({
    type: 'list',
    columns: [{
      //width: '8%',
      header: '关卡编号',
    }, {
      header: '图标',
    }, {
      //width: '140px',
      header: '宝可梦',
    }, {
      header: '属性',
    }, {
      header: 'HP',
    }],
    list: stages.map((stageData, i) => {
      let pokemon = poketoru.pokemon[stageData.PokemonId];
      let drop = [1, 2, 3].map(i => {
        let prob = stageData[`Drop${i}Probabirity`];
        let type = stageData[`Drop${i}type`];
        if (type != 32) return 0;
        return 1 / Math.pow(2, prob)
      }).reduce((a,b)=>a+b,0);
      return [
        i + 1,
        `<a href="#!/pokemon?id=${stageData.PokemonId}">${pokemon.getSprite(32)}</a>`,
        `<a href="#!/eventstage?id=${i}">${pokemon.name}</a>`,
        poketoru.getType(pokemon.type),
        stageData.Hp.toLocaleString(),
        drop ? drop.toFixed(2)  : '',
      ];
    }),
    hover: false,
    card: true,
  });

  let html = `
  ${list}
  `;

  return {
    content: html,
  };
}

export default {

  title: "额外关卡",

  init: async () => {
    await poketoru.init('pokemon', 'ability', 'item');
    await stage.init('event');
  },

  getForm: () => ({
    items: [
      {
        label: "Stages:",
        name: "id",
        type: "select",
        prevnext: true,
        data: getStageList(),
      }
    ],
  }),

  getContent: (search) => {
    let id = ~~search?.id;
    if (search && ('id' in search) && id < poketoru.data.get('StageData').length) {
      return stage.getStageContent(poketoru.data.get('StageData', id));
    }
    else {
      return createMainPage();
    }
  },
};