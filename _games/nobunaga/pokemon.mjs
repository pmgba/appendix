import nobunaga from './nobunaga.mjs';

const stars = ['', '★', '★★', '★★★', '★★★★', '★★★★'];
const scenarioText = ['主线', '剧本A', '剧本B', '剧本C', '剧本D', '剧本E', '剧本F', '剧本G', '剧本H', '剧本I', '剧本J'];
const rankText = ['', 'I', 'II', 'III'];

function createMainPage() {
  let list = databook.component.create({
    type: 'list',
    sortable: true,
    columns: [
      '宝可梦',
      '属性',
      'HP',
      '攻击力',
      '防御力',
      '速度',
      '移动',
    ],
    list: nobunaga.data.get('Pokemon').map((pkmnData, pkmnIndex) => [
      `<a href="#!/pokemon?id=${pkmnIndex}">${pkmnData.Name}</a>`,
      [...new Set(pkmnData.Types)].filter(x => x >= 0).join('/'),
      pkmnData.HP,
      pkmnData.Stats[0],
      pkmnData.Stats[1],
      pkmnData.Stats[2],
      pkmnData.Movement,
    ]),
  });

  return {
    content: list,
  };
}

function createSubPage(pkmnIndex) {
  let pkmnData = nobunaga.data.get('Pokemon')[pkmnIndex];
  if (!pkmnData) return;

  let html = '';
  html += '<h3>基本信息</h3>';
  html += databook.component.create({
    type: 'info',
    list: [
      ['属性', pkmnData.Types[0] + ', ' + pkmnData.Types[1] ],
      ['HP', pkmnData.HP ],
      ['攻击力', pkmnData.Stats[0] ],
      ['防御力', pkmnData.Stats[1] ],
      ['速度', pkmnData.Stats[2] ],
      ['招式', pkmnData.Waza ],
    ],
    image: nobunaga.sprite.get('pokemon', pkmnIndex),
  });
  
  html += '<h3>栖息地</h3>';
  html += databook.component.create({
    type: 'table',
    body: [
      [...Array(11).keys()].map(i => scenarioText[i]),
      [...Array(11).keys()].map(i => nobunaga.data.get('Scenario')[i].AppearPokemon[pkmnIndex] ? '⭕' : '❌'),
    ],
  });
  html += databook.component.create({
    type: 'table',
    body: pkmnData.Habitats.map((habitats,i) => (habitats[0] || habitats[1]) ? [
        nobunaga.sprite.get('kuni', i) + `kuni${i}`,
        habitats[0] ? nobunaga.sprite.get('building', nobunaga.data.get('Building')[i * 7 + 4].Icons[0]) + nobunaga.data.get('Building')[i * 7 + 4].Name : '',
        habitats[1] ? nobunaga.sprite.get('building', nobunaga.data.get('Building')[i * 7 + 5].Icons[0]) + nobunaga.data.get('Building')[i * 7 + 5].Name : '',
      ] : null).filter(x=>!!x),
  });

  html += '<h3>武将</h3>';
  html += databook.component.create({
    type: 'list',
    small: true,
    list: nobunaga.data.get('BaseBushou').map((bushouData, bushouIndex) => [
      nobunaga.sprite.get('busho_s', bushouData.SpriteId > 78 ? bushouData.SpriteId - 21 : bushouData.SpriteId),
      nobunaga.data.get('BaseBushou.Names')[bushouData.NameId],
      bushouData.Types,
      nobunaga.data.get('BaseBushouMaxSyncTable')[bushouIndex][pkmnIndex] + '%', //,
    ]),
  });

  return {
    content: html,
  };
}

export default {

  title: "宝可梦",

  init: async () => {

    await nobunaga.data.load({
      'Pokemon': './data/Pokemon.json',
      'Building': './data/Building.json',
      'Scenario': './data/Scenario.json',
      'BaseBushou': './data/BaseBushou.json',
      'BaseBushou.Names': './data/BaseBushou.Names.json',
      'BaseBushouMaxSyncTable': './data/BaseBushouMaxSyncTable.json',
    });

  },

  getForm: () => ({
    items: [
      {
        label: "Pokemon:",
        name: "id",
        type: "select",
        prevnext: true,
        data: nobunaga.data.get('Pokemon').map((pkmnData, pkmnIndex) => [pkmnIndex, `#${(pkmnIndex + 1).toString().padStart(3, '0')} ${pkmnData.Name}`])
      }
    ],
  }),

  getContent: (search) => {
    if (search?.hasOwnProperty('id')) {
      return createSubPage(~~search.id);
    } else {
      return createMainPage();
    }
  },

}