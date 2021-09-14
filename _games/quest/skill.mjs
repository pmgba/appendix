import quest from './quest.mjs';

function getLearnableSkills() {
  return quest.data.get('skillDataResourcesSet').m_datas
    .map((skillData, skillIndex) => [skillData, skillIndex, quest.data.get('skillname', skillIndex)])
    .filter(([_, __, name]) => name);
}

function createMain() {
  let list = databook.component.create({
    type: 'list',
    columns: [
      {
        header: '图标',
      },
      {
        header: '招式',
      },
      {
        header: '伤害',
      },
      {
        header: '充能时间'
      },
      {
        header: '说明',
        align: 'left',
        width: '50%'
      }
    ],
    list: getLearnableSkills()
      .map(([skillData, skillIndex, skillName]) => [
        '',
        quest.getLink('skill', { id: skillIndex }, skillName),
        Math.round((skillData.m_damagePercent ?? 0) * 100),
        skillData.m_chargeSecond,
        quest.data.get('skillinfo', skillIndex),
      ]),
    sortable: true,
    card: true,
  });
  return {
    content: list,
  };
}

function createSub(skillIndex, skillData) {
  let info = databook.component.create({
    type: 'info',
    list: [
      ['攻击力', Math.round((skillData.m_damagePercent ?? 0) * 100),],
      ['等待时间', skillData.m_chargeSecond],
      ['说明', quest.data.get('skillinfo', skillIndex).replaceAll('。', '。<br>')],
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
        header: '宝可梦',
      },
      {
        header: '属性'
      },
      {
        header: 'HP'
      },
      {
        header: '攻击力'
      }
    ],
    list: quest.data.get('pokemonDataSet').m_datas
      .filter(pokemonData => pokemonData.m_skillIDs.includes(skillIndex))
      .map(pokemonData => [
        quest.sprite.get('pokemon', pokemonData.m_monsterNo, 24),
        quest.getLink('pokemon', { id: pokemonData.m_monsterNo }, quest.data.get('monsname')[pokemonData.m_monsterNo]),
        quest.getTypes([pokemonData.m_type1, pokemonData.m_type2]),
        pokemonData.m_hpBasis,
        pokemonData.m_attackBasis,
      ]),
    card: true,
  });

  let html = `
  <h3>招式</h3>
  ${info}
  <h3>宝可梦</h3>
  ${pokemonList}
  `;

  return {
    content: html,
  };
}

export default {

  title: "招式",

  init: async () => {
    await quest.data.load({
      'pokemonDataSet': './data/auto/pokemon/PokemonDataSet.json',
      'skillDataResourcesSet': './data/auto/skill/SkillDataResourcesSet.json',
      'monsname': './text/zh-Hans/monsname.json',
      'skillname': './text/zh-Hans/skillname.json',
      'skillinfo': './text/zh-Hans/skillinfo.json',
      'typename': './text/zh-Hans/typename.json',
    });
  },

  createForm: () => ({
    items: [
      {
        label: "招式：",
        name: "id",
        type: "select",
        data: getLearnableSkills()
          .map(([_, skillIndex, skillName]) => [
            skillIndex,
            quest.getNumber(skillIndex, 3) + ' ' + skillName
          ])
      }
    ],
  }),

  createContent: (search) => {
    let data = quest.data.get('skillDataResourcesSet').m_datas[search.id];
    if (data) {
      return createSub(~~search.id, data);
    }
    else {
      return createMain();
    }
  },
}