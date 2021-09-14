import poketoru from './poketoru.mjs';

function getPokemonAtk(pokemon) {
  let s = pokemon.getAtk(1) + ` <sub style="color:gray;">(Lv.1)</sub>`;
  s += ' - ';
  s += pokemon.getAtk(10) + ` <sub style="color:gray;">(Lv.10)</sub>`;
  if (pokemon.maxLevel > 10) {
    s += ' - ';
    s += pokemon.getAtk(pokemon.maxLevel) + ` <sub style="color:gray;">(Lv.${pokemon.maxLevel})</sub>`;
  }
  return s;
}

function createSub(id) {
  let pokemon = poketoru.pokemon[id];

  let info = databook.component.create({
    type: 'info',
    image: pokemon.getSprite(),
    list: [
      ['宝可梦', pokemon.name],
      ['编号', pokemon.dex],
      ['属性', poketoru.getType(pokemon.type)],
      ['攻击力', getPokemonAtk(pokemon)],
      ['最大等级提升', pokemon.rml],
    ],
    card: true,
  });

  let megaList = pokemon.getMega();
  for (let mega of megaList) {
    info += databook.component.create({
      type: 'info',
      image: mega.getSprite(),
      list: [
        ['宝可梦', mega.name],
        ['属性', poketoru.getType(mega.type)],
        ['效果', mega.megaEffect],
        ['超级进化', `${mega.megaSpeed} - ${mega.msu} = ${mega.megaSpeed - mega.msu}`],
      ],
      card: true,
    });
  }

  let ability = pokemon.abilities
    .map(x=>poketoru.abilities[x])
    .map(data => {
      let prob = data.probabilities.map(x => x > 0 ? x + '%' : '-').join(' / ');
      let prob2 = data.skillEffect == 1
        ? data.param.map(x => `+${x}%`)
        : ['', '', '', '']
        ;
      let prob3 = data.skillEffect == 1
        ? data.probabilities.map(x => x > 0 ? Math.min(x + data.param[3], 100) + '%' : '-').join(' / ')
        : prob
        ;

      let power = '×' + data.value;
      let power2 = data.skillEffect == 2
        ? data.param.map(x => `×${x}`)
        : ['', '', '', '']
        ;
      let power3 = data.skillEffect == 2
        ? '×' + (data.value * data.param[3]).toFixed(1)
        : power
        ;

      let atk = pokemon.getAtk(pokemon.maxLevel);
      let damage = atk * data.value * (data.skillEffect == 2 ? data.param[3] : 1);
      let damage3 = [1, 1.5, 2].map(x => Math.floor(damage * x)).join(' / ');

      let info = databook.component.create({
        type: 'list',
        columns: [
          {
            header: '技能',
          },
          {
            header: '效果',
          }
        ],
        list: [
          [data.name,
            data.desc]
        ],
        card: false,
        small: true,
        attr: 'style="border-bottom: none;margin-bottom: 0;"'
      });

      let details = databook.component.create({
        type: 'list',
        columns: [
          {
            header: '参数',
            width: '20%',
          },
          {
            header: '基础',
            width: '20%',
          },
          {
            header: '升级',
            span: 4,
          },
          {
            header: '最终',
            width: '20%',
          }
        ],
        list: [
          ['发动几率', prob, ...prob2, prob3],
          ['伤害倍率', power, ...power2, power3],
          ['升级经验', '-', ...data.exp, '-'],
          ['满级伤害', '', '', '', '', '', damage3]
        ],
        card: false,
        small: true,
        attr: 'style="margin-top:-1px;font-size:small;"'
      });

      return databook.component.create({
        type: 'table',
        body: [
          [info],
          [details]
        ],
        card: true,
        small: true,
      });
    })
    .join('')
    ;

  let totalexp = [...Array(pokemon.maxLevel - 1).keys()].map(i => poketoru.data.get('PokemonLevel', i + 1)[pokemon.group - 1]);
  let exp = totalexp.map((exp, j) => j > 0 ? exp - totalexp[j - 1] : exp);
  let level = databook.component.create({
    type: 'list',
    columns: [
      {
        header: '等级',
      },
      {
        header: '攻击力',
      },
      {
        header: '下一级经验值'
      },
      {
        header: '总计经验值',
      }
    ],
    list: [...Array(pokemon.maxLevel).keys()]
      .map(i => [
        i + 1,
        poketoru.data.get('PokemonAttack', i)[pokemon.group - 1],
        exp[i] ?? '-',
        totalexp[i] ?? '-',
      ]),
    card: true,
    small: true,
  });





  let html = `
  <h3>数据</h3>
  ${info}
  <h3>能力</h3>
  ${ability}
  <h3>升级</h3>
  ${level}
    `;
  return {
    subtitle: `${pokemon.name}`,
    content: html,
  };
}

export default {

  title: "宝可梦",

  init: async () => {
    await poketoru.init('pokemon', 'ability');
  },

  getForm: () => ({
    items: [
      {
        label: "Pokemon:",
        name: "id",
        type: "select",
        prevnext: true,
        data: poketoru.pokemon
          .filter(data => !data.isMega && data.dex > 0 && data.dex < 999)
          .sort((a, b) => a.dex - b.dex)
          .map((data) => [
            data.id,
            '#' + data.dex + ' ' + data.name
          ])
      }
    ],
  }),


  getContent: (search) => {

    let id = ~~search?.id;
    if (id > 0) {
      return createSub(id);
    }
    else {
      return { content: '' };
    }

  },
};



