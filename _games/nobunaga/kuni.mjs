import nobunaga from './nobunaga.mjs';

const scenarioText = ['主线', '剧本A', '剧本B', '剧本C', '剧本D', '剧本E', '剧本F', '剧本G', '剧本H', '剧本I', '剧本J'];

[
  nobunaga.pokemon,
  nobunaga.building,
  nobunaga.kuni,
  nobunaga.scenario,
] = await Promise.all([
  databook.loader.getJson('./data/pokemon.json'),
  databook.loader.getJson('./data/building.json'),
  databook.loader.getJson('./data/kuni.json'),
  databook.loader.getJson('./data/Scenario.json'),
]);

function createMainPage() {
  return null;
}

function createSubPage(kuniIndex) {
  let html = '';

  html += '<h3>设施</h3>';
  html += databook.component.create({
    type: 'list',
    columns: [
      '图标',
      '名字',
    ],
    list: nobunaga.building.filter( buildingData => buildingData.Kuni == kuniIndex && buildingData.Icons[0] > -1 ).map( (buildingData, kuniIndex) => [
      nobunaga.sprite.get('building', buildingData.Icons[0]),
      buildingData.Name,
    ]),
  });

  html += '<h3>野生宝可梦</h3>';
  html += databook.component.create({
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

  title: "国家",

  form: () => ({
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

  change: (location) => {
    const id = ~~location.searchParams?.get('id');
    if (id in nobunaga.kuni) {
      return createSubPage(id);
    } else {
      return createMainPage();
    }
  },

};