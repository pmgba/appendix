import poketoru from './poketoru.mjs';

function createSub(id) {
  let skillData = poketoru.abilities[id];

  let prob = skillData.probabilities.map(x => x > 0 ? x + '%' : '-').join(' / ');
  let prob2 = skillData.skillEffect == 1
    ? skillData.param.map(x => `+${x}%`)
    : ['', '', '', '']
    ;
  let prob3 = skillData.skillEffect == 1
    ? skillData.probabilities.map(x => x > 0 ? Math.min(x + skillData.param[3], 100) + '%' : '-').join(' / ')
    : prob
    ;
  let power = '×' + skillData.value;
  let power2 = skillData.skillEffect == 2
    ? skillData.param.map(x => `×${x}`)
    : ['', '', '', '']
    ;
  let power3 = skillData.skillEffect == 2
    ? '×' + (skillData.value * skillData.param[3]).toFixed(1)
    : power
    ;

  let info = databook.component.create({
    type: 'info',
    list: [
      ['能力', skillData.name],
      ['效果', skillData.desc],
    ],
    card: true,
  });

  let details = databook.component.create({
    type: 'list',
    columns: [
      {
        text: '参数',
        width: '20%',
      },
      {
        text: '基础',
        width: '20%',
      },
      {
        text: '升级',
        span: 4,
      },
      {
        text: '最终',
        width: '20%',
      }
    ],
    list: [
      ['发动几率', prob, ...prob2, prob3],
      ['伤害倍率', power, ...power2, power3],
      ['升级经验', '-', ...skillData.exp, '-'],
    ],
    striped: false,
  });

  let pokemonList = databook.component.create({
    type: 'list',
    columns: [
      {
        text: '图标',
      },
      {
        text: '编号',
      },
      {
        text: '宝可梦',
      },
      {
        text: '属性',
      },
      {
        text: '攻击力',
      },
      {
        text: '其他能力',
      }
    ],
    list: poketoru.pokemon
      .filter(data => !data.isMega && data.dex > 0 && data.dex < 999 && data.abilities.includes(id))
      .sort((a, b) => a.dex - b.dex)
      .map((data) => [
        data.getSprite(24),
        data.dex,
        `<a href="#!/pokemon?id=${data.id}">${data.name}</a>`,
        poketoru.getType(data.type),
        data.getAtk(data.maxLevel),
        data.abilities.filter(x => x != id).map(x => poketoru.abilities[x].name).join('/') || '-',
      ]),
  });


  let html = `
  <h3>能力</h3>
  ${info}
  <h3>数据</h3>
  ${details}
  <h3>宝可梦</h3>
  ${pokemonList}
    `;
  return {
    subtitle: `${skillData.name}`,
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
        label: "Skills:",
        name: "id",
        type: "select",
        prevnext: true,
        data: poketoru.abilities
          .map((ability, i) => [
            i,
            '#' + i + ' ' + ability.name
          ])
          .slice(1),
      }
    ],
  }),

  getContent: (search) => {
    let id = ~~search?.id;
    if (id > 0) {
      return createSub(id);
    }
    else {
      return createMainPage();
    }
  },
};

function createMainPage() {
  let list = databook.component.create({
    type: 'list',
    columns: [{
      //width: '8%',
      text: '能力',
    }, {
      text: '说明',
      align: 'left',
    }, {
      text: '触发概率',
    }, {
      text: '伤害倍率',
    }, {
      text: 'HP',
    }],
    list: poketoru.abilities.slice(1).map(abilityData => {
      let prob = abilityData.probabilities.map(x => x > 0 ? x + '%' : '-').join('/');
      let power = '×' + abilityData.getSkillPower();
      let params = abilityData.skillEffect == 1
        ? '+' + abilityData.param.map(x => `${x}%`).join('/')
        : '×' + abilityData.param.map(x => `${x}`).join('/');
      return [
        `<a href="#!/ability?id=${abilityData.id}">${abilityData.name}</a>`,
        abilityData.desc,
        prob,
        power,
        params,
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

