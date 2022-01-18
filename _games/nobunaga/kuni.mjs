import nobunaga from './nobunaga.mjs';

const scenarioText = ['主线', '剧本A', '剧本B', '剧本C', '剧本D', '剧本E', '剧本F', '剧本G', '剧本H', '剧本I', '剧本J'];

function createMainPage() {
  let list = jekyllbook.component.create({
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
    list: nobunaga.pokemon.map((pkmnData, pkmnIndex) => [
      `<a href="#!/pokemon?id=${pkmnIndex}">${pkmnData.Name}</a>`,
      [...new Set(pkmnData.Types)].filter(x => x >= 0).join('/'),
      pkmnData.HP,
      pkmnData.Stats[0],
      pkmnData.Stats[1],
      pkmnData.Stats[2],
      pkmnData.Movement,
    ]),
  });
  return list;
}

function createSubPage(kuniIndex) {
  let html = '';

  html += '<h3>设施</h3>';
  html += jekyllbook.component.create({
    type: 'list',
    columns: [
      '图标',
      '宝可梦',
    ],
    list: nobunaga.building.filter( buildingData => buildingData.Kuni == kuniIndex ).map( (buildingData, kuniIndex) => [
      nobunaga.sprite.get('building', buildingData.Icons[0]),
      buildingData.Name,
    ]),
  });

  html += '<h3>野生宝可梦</h3>';
  html += jekyllbook.component.create({
    type: 'list',
    columns: [
      '图标',
      '宝可梦',
      ...[...Array(11).keys()].map(i => scenarioText[i])
    ],
    small: true,
    list: nobunaga.pokemon.map( (pkmnData, pkmnIndex) => [
      nobunaga.sprite.get('pokemon', pkmnIndex),
      pkmnData.Name,
      ...[...Array(11).keys()].map(i => nobunaga.scenario[i].AppearPokemon[pkmnIndex] ? '⭕' : ''),
    ]),
  });
  return html;
}

export default {

  init: async () => {
    [
      nobunaga.pokemon,
      nobunaga.building,
      nobunaga.kuni,
      nobunaga.scenario,
    ] = await Promise.all([
      jekyllbook.loader.getJson('./data/pokemon.json'),
      jekyllbook.loader.getJson('./data/building.json'),
      jekyllbook.loader.getJson('./data/kuni.json'),
      jekyllbook.loader.getJson('./data/Scenario.json'),
    ]);
  },

  title: "国家",

  createForm: () => ({
    items: [
      {
        label: "Kuni:",
        name: "id",
        type: "select",
        prevnext: true,
        data: nobunaga.kuni.map((v, i) => [i, v.Name])
      }
    ],
  }),

  getContent: (search) => ({
    title: "yes",
    content: ('id' in search) && (search.id >=0) && search.id <=200
      ? createSubPage(~~search.id)
      : createMainPage(),
  }),

}