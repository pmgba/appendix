import poketoru from './poketoru.mjs';
import stageloader from './stageloader.mjs';

function getStageList() {
  let stages = stageloader.getStages('extra');
  let options = stages.map(stage => {
    let pokemon = stage.getPokemon();
    return [
      stage.id,
      `${stage.id + 1} ${pokemon.name}`
    ];
  });
  return options;
}

function createMainPage() {
  let stages = stageloader.getStages('extra');
  let list = databook.component.create({
    type: 'list',
    columns: [{
      header: '编号',
    }, {
      header: '图标',
    }, {
      header: '宝可梦',
    }, {
      header: '属性',
    }, {
      header: '时间',
    }, {
      header: 'HP',
    }, {
      header: '初始布局',
    }],
    list: stages.map(stage => {
      let pokemon = stage.getPokemon();
      return([
        stage.id + 1,
        `<a href="#!/pokemon?id=${pokemon.id}">${pokemon.getSprite()}</a>`,
        `<a href="#!/extrastage?id=${stage.id}">${pokemon.name}</a>`,
        poketoru.getType(pokemon.type),
        stage.getMovesOrTimes(),
        stage.getHp(),
        stage.getThumbnail(),
      ]);
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
    await stageloader.init('extra');
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
    let stage = stageloader.getStage('extra', id);
    if (search && ('id' in search) && stage) {
      return stage.getContent();
    }
    else {
      return createMainPage();
    }
  },
};