import quest from './quest.mjs';

function createMain() {
  let list = databook.component.create({
    type: 'list',
    columns: ['图标', '编号', '宝可梦', '属性', 'HP', '攻击力'],
    list: quest.database.get('pokemonDataSet').m_datas
      .map((pokemonData, index) => [
        quest.sprite.get('pokemon', pokemonData.m_monsterNo, 24),
        quest.getNumber(pokemonData.m_monsterNo),
        quest.getLink('pokemon', { id: pokemonData.m_monsterNo }, quest.database.get('monsname')[pokemonData.m_monsterNo]),
        quest.getTypes([pokemonData.m_type1, pokemonData.m_type2]),
        pokemonData.m_hpBasis,
        pokemonData.m_attackBasis,
      ])
      .slice(1),
    sortable: true,
    card: true,
  });

  return {
    content: list,
  };
}

function createSub(pokemonData, pokemonIndex) {
  let name = quest.database.get('monsname', pokemonIndex);
  let info = databook.component.create({
    type: 'info',
    image: quest.sprite.get('pokemon', pokemonIndex),
    list: [
      ['属性', quest.getTypes([pokemonData.m_type1, pokemonData.m_type2])],
      ['HP', pokemonData.m_hpBasis],
      ['Atk', pokemonData.m_attackBasis],
      ['攻击方式', pokemonData.m_meleePercent ? '近战' : '远程'],
    ],
    card: true,
  });

  let list = databook.component.create({
    type: 'list',
    columns: [
      {
        text: '招式',
      },
      {
        text: '伤害',
      },
      {
        text: '充能时间'
      },
      {
        text: '说明',
        align: 'left',
        width: '50%'
      }
    ],
    list: pokemonData.m_skillIDs
      .filter(skillIndex => skillIndex > 0 && skillIndex < 65535)
      .map(skillIndex => [quest.database.get('skillDataResourcesSet').m_datas[skillIndex], skillIndex])
      .map(([skillData, skillIndex]) => [
        quest.getLink('skill', { id: skillIndex }, quest.database.get('skillname', skillIndex)),
        Math.round((skillData.m_damagePercent ?? 0) * 100),
        skillData.m_chargeSecond,
        quest.database.get('skillinfo', skillIndex),
      ]),
    card: true,
  });
  let html = `
    <h3>数据</h3>
    ${info}
    <h3>招式</h3>
    ${list}
    `;
  return {
    subtitle: `${name}`,
    content: html,
  };
}



export default {

  title: "宝可梦",

  init: async () => {
    await quest.database.load({
      'pokemonDataSet': './data/auto/pokemon/PokemonDataSet.json',
      'skillDataResourcesSet': './data/auto/skill/SkillDataResourcesSet.json',
      'monsname': './text/zh-Hans/monsname.json',
      'skillname': './text/zh-Hans/skillname.json',
      'skillinfo': './text/zh-Hans/skillinfo.json',
      'typename': './text/zh-Hans/typename.json',
    });
  },

  form: () => ({
    items: [
      {
        label: "Pokemon:",
        name: "id",
        type: "select",
        prevnext: true,
        data: quest.database.get('pokemonDataSet').m_datas
          .map((data, index) => [
            index,
            quest.getNumber(index) + quest.database.get('monsname', index)
          ])
          .slice(1)
      }
    ],
  }),

  change: (location) => {
    const id = ~~location.searchParams?.get('id');
    const pokemonData = quest.database.get('pokemonDataSet').m_datas[id];
    if (id > 0 && pokemonData) {
      return createSub(pokemonData, id);
    }
    else {
      return createMain();
    }
  },
}