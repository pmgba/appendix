import poketoru from './poketoru.mjs';
import stageloader from './stageloader.mjs';

function getBeginTime(eventStage) {
  switch (eventStage.EventLoop) {
    case 1: // EventLoopWeek
      return `第${eventStage.LoopValue1 + 1}周`;
    case 2: // EventLoopWeekDay
      return '每周' + ['一', '二', '三', '四', '五', '六', '日'][eventStage.LoopValue1 - 1];
    case 3: // EventLoopYear
      return `${eventStage.LoopValue1}月${eventStage.LoopValue2}日`;
    case 4: // EventLoopMonth
      return `每月${eventStage.LoopValue1}日`;
  }
}

function getDuration(eventStage) {
  return (eventStage.LoopDuration / 60 / 24 || 1) + '天';
}

function createMainpage() {
  let html = '';

  let table = Array.from(Array(24), () => new Array(14 - 4 + 1));
  for (let iy = 0; iy < 24; iy++) {
    for (let ix = 4; ix <= 14; ix++) {
      let i = poketoru.data.get('EventStage').findIndex(x => x.EventLoop == 1 && x.LoopValue1 == iy && x.Sort == ix);
      if (i == -1) {
        table[iy][ix] = "";
      } else {
        let eventStage = poketoru.data.get('EventStage', i);
        let stageId = (eventStage.Type == 6 || eventStage.Type == 7)
          ? poketoru.data.get('EventStageExtendSetting', eventStage.Stages[0] + 1).StageId
          : eventStage.Stages[0];
        let stage = stageloader.getStage('event', stageId);
        let pokemon = stage.getPokemon();

        table[iy][ix] = `<a href="#!/event?id=${i}" style="font-size:small;">${pokemon.getSprite(48)}<br>${pokemon.name}</a>`;
      }
    }
  }
  table = table.map((x, i) => [`第${i + 1}周`, ...x.slice(5)]);
  html += '<h2>每周轮替</h2>';
  html += databook.component.create({
    type: 'list',
    list: table,
    hover: false,
    card: true,
  });

  for (let el = 2; el <= 4; el++) {
    let eventStages = poketoru.data.get('EventStage').map((x, i) => x.EventLoop == el ? i : false).filter(x=>x!==false);
    let list = eventStages.map(i => {
      let eventStage = poketoru.data.get('EventStage', i);
      let stageId = (eventStage.Type == 6 || eventStage.Type == 7)
        ? poketoru.data.get('EventStageExtendSetting', eventStage.Stages[0] + 1).StageId
        : eventStage.Stages[0];
      let stage = stageloader.getStage('event', stageId);
      let pokemon = stage.getPokemon();
      return [
        pokemon.getSprite(24),
        `<a href="#!/event?id=${i}">${pokemon.fullname}</a>`,
        getBeginTime(eventStage),
        getDuration(eventStage),
      ];
    });
    html += '<h2>每周轮替</h2>';
    html += databook.component.create({
      type: 'list',
      columns: [
        '图标',
        '宝可梦',
        '出现时间',
        '持续时间',
      ],
      list: list,
      card: true,
    });
  }

  return {
    content: html,
  };
}

function createSubpage(id) {
  let eventStage = poketoru.data.get('EventStage', id);
  let extend = [];
  let stages = [];
  if (eventStage.Type == 6 || eventStage.Type == 7) {
    let extendSetting = poketoru.data.get('EventStageExtendSetting');
    for (let i = eventStage.Stages[0] + 1; i < extendSetting.length; i++) {
      if (extendSetting[i].StageId == 0) break;
      extend.push(extendSetting[i]);
    }
    stages = extend.map(x => x.StageId).map(x => stageloader.getStage('event', x));
  } else {
    stages = eventStage.Stages.filter(x => x >= 0).map(x => stageloader.getStage('event', x));
  }
  let firstPokemon = stages[0].getPokemon();

  let htmlList;
  let tabs = [];
  if (eventStage.Type == 2) { // weekly
    let list = [];
    for (let i = 0; i < stages.length; i++) {
      let time = '星期' + ['一', '二', '三', '四', '五', '六', '日'][i];
      let pokemon = stages[i].getPokemon();
      tabs.push({
        text: pokemon.fullname,
        content: stages[i].getContent(),
      });
      list.push([
        pokemon.getSprite(24),
        pokemon.fullname,
        poketoru.getType(pokemon.type),
        time,
      ]);
    }
    htmlList = databook.component.create({
      type: 'list',
      columns: [
        '图标',
        '宝可梦',
        '属性',
        '出现时间',
      ],
      list: list,
      card: true,
    });
  } else if (eventStage.Type == 6) { // level up
    let list = [];
    let pokemon = stages[0].getPokemon();
    for (let i = 0; i < stages.length; i++) {
      let name;
      let levelBegin = extend[i].Params[0];
      let hp = stages[i].getHp(0);
      if (i == stages.length - 1) {
        name = levelBegin + '+';
      } else {
        let levelEnd = extend[i + 1].Params[0] - 1;
        name = levelBegin;
        if (levelEnd > levelBegin) {
          name += '-' + levelEnd;
          hp += ' - ' + stages[i].getHp(levelEnd - levelBegin - 1);
        }
      }
      tabs.push({
        text: name,
        content: stages[i].getContent(),
      });
      list.push([
        name,
        stages[i].getDifficulty(),
        stages[i].getMovesOrTimes(),
        hp,
        stages[i].getThumbnail(4),
      ]);
    }
    htmlList = databook.component.create({
      type: 'list',
      columns: [
        '等级',
        '难度',
        '限制',
        'HP',
        '布局',
      ],
      list: list,
      card: true,
    });
  } else if (eventStage.Type == 7) { // safari
    let list = [];
    let sum = extend.reduce((s, x) => s + ~~x.Params[0], 0);
    for (let i = 0; i < stages.length; i++) {
      let pokemon = stages[i].getPokemon();
      tabs.push({
        text: pokemon.fullname,
        content: stages[i].getContent(),
      });
      list.push([
        pokemon.getSprite(24),
        pokemon.fullname,
        poketoru.getType(pokemon.type),
        `${extend[i].Params[0]}/${sum}`,
        (~~extend[i].Params[0] / sum).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 }),
      ]);
    }
    htmlList = databook.component.create({
      type: 'list',
      columns: [
        '图标',
        '宝可梦',
        '属性',
        '分布量',
        '出现概率',
      ],
      list: list,
      card: true,
    });
  } else {
    tabs.push({
      content: stages[0].getContent(),
    });
  }

  let html = '<h2>活动信息</h2>';
  html += databook.component.create({
    type: 'info',
    image: firstPokemon.getSprite(),
    list: [
      ['开始时间', eventStage.Begin],
      ['结束时间', eventStage.End],
      ['出现时间', getBeginTime(eventStage)],
      ['持续时间', getDuration(eventStage)],
    ],
    card: true,
  });
  if (htmlList) {
    html += '<h2>关卡列表</h2>' + htmlList;
  }

  html += '<h2>关卡内容</h2>';
  if (tabs.length > 1) {
    html += databook.component.create({
      type: 'tabs',
      tabs: tabs,
      card: true,
    });
  } else {
    html += tabs[0].content;
  }

  return {
    subtitle: firstPokemon.name,
    content: html,
  };
}

export default {

  title: "活动列表",

  init: async () => {
    await poketoru.init('pokemon', 'ability', 'item');
    await stageloader.init('event');
    await poketoru.data.load({
      'EventStage': './data/EventStage.json',
      'EventStageExtendSetting': './data/EventStageExtendSetting.json',
    });
  },

  getContent: (search) => {
    let id = ~~search?.id;
    if (search && ('id' in search)) {
      return createSubpage(id);
    }
    else {
      return createMainpage();
    }
  },
};