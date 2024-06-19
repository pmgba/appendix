import quest from './quest.mjs';

await quest.database.load({
  'pokemonDataSet': './data/auto/pokemon/PokemonDataSet.json',
  'skillDataResourcesSet': './data/auto/skill/SkillDataResourcesSet.json',
  'monsname': './text/zh-Hans/monsname.json',
  'skillname': './text/zh-Hans/skillname.json',
  'skillinfo': './text/zh-Hans/skillinfo.json',
  'typename': './text/zh-Hans/typename.json',
});

const learnableSkills = quest.database.get('skillDataResourcesSet').m_datas
  .map((skillData, skillIndex) => [skillData, skillIndex, quest.database.get('skillname', skillIndex)])
  .filter(x => x[2]);

function createMain() {
  const list = databook.component.create({
    type: 'list',
    columns: [
      {
        text: '图标',
      },
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
    list: learnableSkills
      .map(([skillData, skillIndex, skillName]) => [
        '',
        quest.getLink('skill', { id: skillIndex }, skillName),
        Math.round((skillData.m_damagePercent ?? 0) * 100),
        skillData.m_chargeSecond,
        quest.database.get('skillinfo', skillIndex),
      ]),
    sortable: true,
    card: true,
  });
  return {
    content: list,
  };
}

function createSub(skillData, skillIndex) {
  const info = databook.component.create({
    type: 'info',
    list: [
      ['攻击力', Math.round((skillData.m_damagePercent ?? 0) * 100),],
      ['充能时间', skillData.m_chargeSecond],
      ['说明', quest.database.get('skillinfo', skillIndex).replaceAll('。', '。<br>')],
    ],
    card: true,
  });

  const pokemonList = databook.component.create({
    type: 'list',
    columns: [
      {
        text: '图标',
      },
      {
        text: '宝可梦',
      },
      {
        text: '属性'
      },
      {
        text: 'HP'
      },
      {
        text: '攻击力'
      }
    ],
    list: quest.database.get('pokemonDataSet').m_datas
      .filter(pokemonData => pokemonData.m_skillIDs.includes(skillIndex))
      .map(pokemonData => [
        quest.sprite.get('pokemon', pokemonData.m_monsterNo, 24),
        quest.getLink('pokemon', { id: pokemonData.m_monsterNo }, quest.database.get('monsname')[pokemonData.m_monsterNo]),
        quest.getTypes([pokemonData.m_type1, pokemonData.m_type2]),
        pokemonData.m_hpBasis,
        pokemonData.m_attackBasis,
      ]),
    card: true,
  });

  const html = `
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


  form: () => ({
    items: [
      {
        label: "招式：",
        name: "id",
        type: "select",
        data: learnableSkills
          .map(([_, skillIndex, skillName]) => [
            skillIndex,
            quest.getNumber(skillIndex, 3) + ' ' + skillName
          ])
      }
    ],
  }),

  change: (location) => {
    const id = ~~location.searchParams?.get('id');
    const data = learnableSkills.find(x => x[1] == id);
    if (id > 0 && data) {
      return createSub(data[0], id);
    }
    else {
      return createMain();
    }
  },
};