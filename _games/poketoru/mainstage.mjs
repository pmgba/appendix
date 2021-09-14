import poketoru from './poketoru.mjs';
import stageloader from './stageloader.mjs';

const areaDataArray = [
  [0, 0, ""],
  [1, 10, "纯白港口"],
  [11, 20, "沙棕街市"],
  [21, 30, "墨黑祭典"],
  [31, 45, "碧蓝海滩"],
  [46, 60, "彩虹公园"],
  [61, 75, "胭红画廊"],
  [76, 90, "糖果屋"],
  [91, 105, "白银博物馆"],
  [106, 120, "寒冬山"],
  [121, 135, "暗夜城堡"],
  [136, 150, "翠绿丛林"],
  [151, 180, "玩具工厂"],
  [181, 210, "岩石山谷"],
  [211, 240, "洁白城镇"],
  [241, 300, "玫瑰中心"],
  [301, 350, "阴影沙漠"],
  [351, 400, "紫罗兰宫殿"],
  [401, 450, "蓝色沙龙"],
  [451, 500, "灰色大厅"],
  [501, 550, "午夜嘉年华"],
  [551, 600, "绿树林"],
  [601, 650, "蓝宝石海滨"],
  [651, 700, "棕色小径"],
];

function createSelection() {
  let stages = poketoru.data.get('StageData');
  let options = {};
  for (let [begin, end, name] of areaDataArray.slice(1)) {
    let list = [];
    for (let i = begin; i <= end; i++) {
      let stageData = stages[i];
      let pokemon = poketoru.pokemon[stageData.PokemonId];
      list.push([i, `${i} ${pokemon.name}`]);
    }
    options[name] = list;
  }
  return options;
}

function createMainPage() {
  let html = '';

  for (let areaIndex = 1; areaIndex < areaDataArray.length; areaIndex++) {
    let [begin, end, name] = areaDataArray[areaIndex];
    html += `<h3>${poketoru.getLink('mainstage', { area: areaIndex }, name)}</h3>`;
    let col = 5;
    let list = [];
    for (let i = begin; i <= end; i += col) {
      let row = [];
      for (let j = i; j < i + col; j++) {
        if (j <= end) {
          let stage = stageloader.getStage('main', j);
          let pokemon = stage.getPokemon();
          row.push(`<small>${j}</small><br><a href="#!/pokemon?id=${pokemon.id}">${pokemon.getSprite(32)}</a><br /><a href="#!/mainstage?id=${j}" style="font-size:small">${pokemon.name}</a>`);
        } else {
          row.push('');
        }
      }
      list.push(row);
    }
    html += databook.component.create({
      type: 'table',
      style: 'table-layout:fixed;',
      body: list,
      hover: false,
      card: true,
    });
  }

  return {
    content: html,
  };
}

function createArea(areaIndex) {
  let [begin, end, name] = areaDataArray[areaIndex];
  let list = [];
  for (let i = begin; i <= end; i++) {
    let stage = stageloader.getStage('main', i);
    let pokemon = stage.getPokemon();
    let drop = stage.getDrops(true).find(x=>x.type==32)?.prob;

    list.push([
      i,
      `<a href="#!/pokemon?id=${pokemon.id}">${pokemon.getSprite()}</a>`,
      `<a href="#!/mainstage?id=${i}">${pokemon.name}</a>`,
      poketoru.getType(pokemon.type),
      stage.getMovesOrTimes(),
      stage.getHp(),
      stage.getThumbnail(),
      drop ? (drop * 100).toFixed(2) + '%'  : '',
    ]);
  }

  let html = ``;

  html += databook.component.create({
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
      header: '步数',
    }, {
      header: 'HP',
    }, {
      header: '初始布局',
    }, {
      header: '掉落',
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

  getForm: () => ({
    items: [
      {
        label: "Stages:",
        name: "id",
        type: "select",
        prevnext: true,
        groups: createSelection(),
      }
    ],
  }),

  validate(search) {

  },

  getContent: (search) => {
    let id = ~~search?.id;
    let area = ~~search?.area;
    let stage = stageloader.getStage('main', id);
    if (stage) {
      let pokemon = stage.getPokemon();
      return {
        subtitle: pokemon.name,
        content: stage.getContent(),
      };
    }
    else if (area > 0 && area < areaDataArray.length) {
      return createArea(area);
    } else {
      return createMainPage();
    }
  },
};






// error: 324
