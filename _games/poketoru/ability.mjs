import poketoru from './poketoru.mjs';

function createSub(id) {
  let skillData = poketoru.AbilityList[id];

  let probs = [skillData.Probability3, skillData.Probability4, skillData.Probability5];

  let prob = probs.map(x => x > 0 ? x + '%' : '-').join(' / ');
  let prob2 = skillData.SkillEffect == 1
    ? skillData.Param.map(x => `+${x}%`)
    : ['', '', '', '']
    ;
  let prob3 = skillData.SkillEffect == 1
    ? probs.map(x => x > 0 ? Math.min(x + skillData.Param[3], 100) + '%' : '-').join(' / ')
    : prob
    ;
  let power = '×' + skillData.Value;
  let power2 = skillData.SkillEffect == 2
    ? skillData.Param.map(x => `×${x}`)
    : ['', '', '', '']
    ;
  let power3 = skillData.SkillEffect == 2
    ? '×' + (skillData.Value * skillData.Param[3]).toFixed(1)
    : power
    ;

  let info = databook.component.create({
    type: 'info',
    list: [
      ['能力', skillData.Name],
      ['效果', skillData.Desc],
    ],
    card: true,
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
      ['升级经验', '-', ...skillData.Exp, '-'],
    ],
    card: true,
  });

  let pokemonList = databook.component.create({
    type: 'list',
    columns: [
      {
        header: '图标',
      },
      {
        header: '编号',
      },
      {
        header: '宝可梦',
      },
      {
        header: '属性',
      },
      {
        header: '攻击力',
      },
      {
        header: '其他能力',
      }
    ],
    list: poketoru.PokemonList
      .filter(data => !data.isMega && data.dex > 0 && data.dex < 999 && data.abilities.includes(id))
      .sort((a, b) => a.dex - b.dex)
      .map((data) => [
        data.getSprite(24),
        data.dex,
        `<a href="#!/pokemon?id=${data.id}">${data.name}</a>`,
        poketoru.getType(data.type),
        data.getAtk(data.maxLevel),
        data.abilities.filter(x => x != id).map(x => poketoru.AbilityList[x].Name).join('/') || '-',
      ]),
    card: true,
    small: true,
  });


  let html = `
  <h3>数据</h3>
  ${info}
  ${details}
  <h3>能力</h3>
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
      header: '能力',
    }, {
      header: '说明',
      align: 'left',
    }, {
      header: '触发概率',
    }, {
      header: '伤害倍率',
    }, {
      header: 'HP',
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

