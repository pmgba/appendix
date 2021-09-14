import poketoru from './poketoru.mjs';

const rankTextArray = 'SABC';
const rankColorArray = ['goldenrod', 'blue', 'green', 'red'];
const stages = [];

const pieceMap = {
  1152: 'rock',
  1153: 'block',
  1154: 'coin',

  1990: 'a',
  1991: 'b',
  1992: 'c',
  1993: 'd',
  1994: 'e',
  1995: 'f',
  1996: 'nomegaa',
  1997: 'nomegab',
  1998: 'nomegac',

  2100: 'a',
  2101: 'b',
  2102: 'c',
  2103: 'd',
  2104: 'e',
  2105: 'f',

  2200: 'rock',
  2201: 'block',
  2202: 'coin',
  2203: 'cloud',
  2204: 'barrier',
};
const pieceNames = {
  'default': '',
  'rock': '岩石',
  'block': '铁块',
  'coin': '硬币',
  'barrier': '屏障',
  'cloud': '黑云',
  'clear': '消除遮罩',
  'area': '区域',
  'self': '自己',
  'a': '支援宝可梦A',
  'b': '支援宝可梦B',
  'c': '支援宝可梦C',
  'd': '支援宝可梦D',
  'e': '支援宝可梦E',
  'f': '支援宝可梦',
  'nomegaa': '非超级进化宝可梦A',
  'nomegab': '非超级进化宝可梦B',
  'nomegac': '非超级进化宝可梦C',
};

class Stage {
  data;
  type;
  id;

  constructor(data, type, id) {
    this.data = data;
    this.type = type;
    this.id = id;
  }

  getPokemon() {
    return poketoru.pokemon[this.data.PokemonId];
  }

  getDifficulty() {
    return '<i class="fas fa-star" />'.repeat(this.data.Difficulty);
  }

  getHp(level = null) {
    let hpText = '';
    // 0=NormalStage, 1=GymBattle, 2=CoinStage, 3=RankingStage, 4=LevelUpStage
    if (this.data.StageType == 3) {
      hpText = '无限';
    } else if (this.data.StageType == 4 && level !== null) {
      hpText = (this.data.Hp + this.data.HpIncrease * level).toLocaleString();
    } else if (this.data.StageType == 4) {
      hpText = this.data.Hp.toLocaleString();
      if(this.data.HpIncrease) hpText += ` + ${this.data.HpIncrease}/级`;
    } else {
      hpText = this.data.Hp.toLocaleString();
    }
    return hpText;
  }

  getMovesOrTimes() {
    if (this.data.Times) {
      return Math.floor(this.data.Times / 60) + ':' + (this.data.Times % 60).toString().padStart(2, '0');
    } else {
      return `${this.data.Moves}步`;
    }
  }

  getContent() {
    let pokemon = this.getPokemon();
    let hpText = this.getHp();

    let rankText = this.data.StageType <= 1
      ? [...new Set(this.data.Ranks)].map((v, i) => `<span style="color:${rankColorArray[i]};font-weight:bold;">${rankTextArray[i]}：${v}</span>`).join(' / ')
      : false;

    let defaultPokemonIcons = poketoru.data.get('PokemonSet', this.data.PokemonSetIndex).slice(0, this.data.DefaultPokemonCount).map(x => getPiece(pieceMap[x] ?? x, 24, false, true)).join('');
    let itemText = poketoru.data.get('ItemPattern', this.data.Itemset).Items.filter(x => x > 0).map(x => poketoru.items[x].getSprite(24)).join('');
    let costText = this.data.CostType == 0 ? `${poketoru.sprite.get('item', '422ED65C', 24)}×${this.data.CostValue}`
      : `${poketoru.sprite.get('item', '13F1339E', 24)}×${this.data.CostValue}`;


    let catchText = (this.data.StageType == 0) ? `${this.data.CatchRate}% + ${this.data.CatchBonus}%/${this.data.Times ? '3秒' : '步'}`
      : (this.data.StageType == 4) ? '1%+1%/级'
        : '-';

    let dropText = this.getDrops(false).map(x => `${x.text}(${(x.prob).toLocaleString(undefined,{style: 'percent', maximumFractionDigits:2})})`).join(', ');

    let info = databook.component.create({
      type: 'info',
      image: pokemon.getSprite(),
      list: [
        ['宝可梦', poketoru.getLink('pokemon', { id: pokemon.id }, pokemon.fullname)],
        ['属性', poketoru.getType(pokemon.type)],
        ['HP', hpText],
        [this.data.Times ? '限时' : '步数', this.getMovesOrTimes()],
        ['道具', itemText],
        ['默认落下', defaultPokemonIcons],
        rankText ? ['评价', rankText] : null,
        ['消耗', costText],
        ['捕捉率', catchText],
        ['掉落', dropText || '无'],
      ],
      card: true,
    });

    let layoutText = '';
    if (this.data.LayoutIndex > 0) {
      let screenCount = this.getStageLayoutData()[this.data.LayoutIndex].Length || 1;
      for (let i = 0; i < screenCount; i++) {
        let grid = this.getLayout(i);
        layoutText = grid.toTable(36, screenCount > 1 ? i + 1 : null) + layoutText;
      }
      layoutText = '<div class="p-grid-border">' + layoutText + '</div>';
      layoutText = '<div class="p-grid-wrapper">' + layoutText + '</div>';
    }
    else {
      layoutText = '完全随机';
    }

    let actionText = this.getActions();

    let html = `
    <h3>关卡信息</h3>
    ${info}
    <h3>初始盘面</h3>
    ${layoutText}
    <h3>干扰</h3>
    ${actionText}
    `;
    return html;

  }

  getStageLayoutData() {
    let name = {
      'main': 'StageLayout',
      'extra': 'StageLayoutExtra',
      'event': 'StageLayoutEvent'
    }[this.type];
    return poketoru.data.get(name);
  }

  getLayout(screenIndex = 0) {
    let layoutIndex = this.data.LayoutIndex + screenIndex * 6;
    let array = this.getStageLayoutData().slice(layoutIndex, layoutIndex + 6); //!!!
    let grid = new Grid(6, 6);
    for (let iy = 0; iy < array.length; iy++) {
      for (let ix = 0; ix < 6; ix++) {
        let block = array[iy][`Block${ix + 1}`];
        let cover = array[iy][`Cover${ix + 1}`];
        if (block > 0) {
          let pieceId = this.getPieceId(block);
          grid.set(ix, iy, pieceId);
        } else if (screenIndex == 0) {
          grid.set(ix, iy, 'default');
        }
        if (cover == 4 || cover == 5) {
          let pieceId = { 4: 'cloud', 5: 'barrier' }[cover];
          grid.set(ix, iy, pieceId);
        }
      }
    }
    return grid;
  }

  getThumbnail(size = 12) {
    if (this.data.LayoutIndex) {
      return this.getLayout(0).toTable(size);
    }
    else {
      return (new Grid()).toTable(size);
    }
  }

  getPieceId(id) {
    id = pieceMap[id] ?? id;
    if (id == 2000) { id = this.data.PokemonId; }
    return id;
  }

  getDrops(merge) {
    let drops = [];
    for (let i = 1; i <= 3; i++) {
      let prob = this.data[`Drop${i}Probabirity`];
      let type = this.data[`Drop${i}type`];
      if (type == 0) continue;
      let dropItem = poketoru.data.get('StageDropItem', type);
      let itemText = (dropItem.Type == 7) ? poketoru.sprite.get('item', 'D4B414F0', 24)
        : '';
      drops.push({
        type: type,
        text: itemText + '×' + dropItem.Count,
        prob: 1 / Math.pow(2, prob - 1),
      });
    }
    if (merge) {
      let drops2 = {};
      for (let drop of drops) {
        if (drop.text in drops2) {
          drops2[drop.text].prob += drop.prob;
        }
        else {
          drops2[drop.text] = drop;
        }
      }
      return Object.values(drops2);
    }
    else {
      return drops;
    }

  }

  getActions() {
    let html = '';
    for (var patternIndex = 0; patternIndex < this.data.ActionPatterns.length; patternIndex++) {
      let action = this.data.ActionPatterns[patternIndex];
      if (action.SwitchValue == 0 && action.ActionIndex == 0) {
        if (patternIndex == 0) {
          html += `这只宝可梦不使用干扰。`;
        }
        continue;
      }

      html += `<h4>模式${patternIndex + 1}</h4>`;

      let actionText = '<ul><li>';
      if (action.Immediately) {
        actionText += '第一次直接施放，之后';
      }
      switch (action.ActionType) {
        case 0:
          actionText += action.TimeCD
            ? `每移动${action.TimeCD}步，`
            : `每倒数${action.MoveCD}步，`;
          break;
        case 1:
          actionText += `每作出一次${action.ActionValue}消起手的移动，`;
          break;
        case 3:
          actionText += `每做出一次≤${action.ActionValue}的连锁，`;
          break;
        case 4:
          actionText += `每做出一次≥${action.ActionValue}的连锁，`;
          break;
      }
      actionText += `${action.SelectAction ? '按顺序' : '随机'}施放一项干扰。</li>`;

      if (action.SwitchValue) {
        actionText += '<li>';
        switch (action.ChangeActionCondition) {
          case 0: // LeftHP
            actionText += `如果剩余HP≤${action.SwitchValue}（分数＞${this.data.Hp - action.SwitchValue}），`;
            break;
          case 1: // Count
            actionText += `施放${action.SwitchValue}次后，`;
            break;
          case 2: // UseCount
            actionText += `如果剩余步数≤${action.SwitchValue}，`;
            break;
          case 3: // Turn
            actionText += `经过${action.SwitchValue}回合后，`;
            break;
          default:
            actionText += `Unknown ChangeActionCondition: ${action.ChangeActionCondition}`;
        }
        actionText += `切换至${patternIndex == 2 && this.data.OjamaFlag ? '上一个' : '下一个'}模式。</li>`;
      }
      actionText += '</ul>';
      html += actionText;

      let indexes = poketoru.data.get('BossAction', action.ActionIndex).filter(Boolean);
      let list = [];
      let cellSize = 16;

      for (let i = 0; i < indexes.length; i++) {
        if (indexes[i] == 61001) {
          list.push([
            i + 1,
            getArea(0, 0, 6, 6).area.toTable(cellSize),
            '',
            '将盘面（包括下落的方块）初始化。',
          ]);
          continue;
        }

        let bapd = poketoru.data.get('BossActionPokemonData', indexes[i]);
        let
          x = bapd.X,
          y = bapd.Y,
          w = bapd.Width,
          h = bapd.Height;
        let areaFigure, shapeFigure, patternFigure;
        let text = '';
        
        if (bapd.Blocks[0] == 0) {
          text = "无";
        } else if (bapd.Count == 25) {
          let count = 36;
          areaFigure = getArea(0, 0, 6, 6).area.toTable(cellSize);
          //areaText = `整个盘面`;

          let baslIndex = bapd.Blocks[0];
          let basl = poketoru.data.get('BossActionStageLayout').slice(baslIndex, baslIndex + 6);
          let patternGrid = new Grid(6, 6);
          let pieces = [];
          for (let iy = 0; iy < basl.length; iy++) {
            for (let ix = 0; ix < 6; ix++) {
              let block = basl[iy][`Block${ix + 1}`];
              let cover = basl[iy][`Cover${ix + 1}`];
              if (block > 0) {
                let pieceId = this.getPieceId(block);
                patternGrid.set(ix, iy, pieceId);
                pieces.push(pieceId);
              }
              if (cover > 0) {
                let pieceId = { 1: 'clear', 2: 'cloud', 3: 'barrier' }[cover];
                patternGrid.set(ix, iy, pieceId);
                pieces.push(pieceId);
              }
            }
          }
          patternFigure = patternGrid.toTable(cellSize);
          let blockText = getPieceList(pieces);
          text = `将盘面变成如图所示的形状：${blockText}`;
        } else {
          let isRandomArea = x == 6 || y == 6;
          let count = bapd.Count >= 13 ? bapd.Count - 12
            : bapd.Count == 1 ? w * h
              : bapd.Count || 1;
          let blocks = [...bapd.Blocks];
          if (bapd.Count != 1) {
            for (let i = 1; i < count; i++) {
              if (blocks[i] == 0) blocks[i] = blocks[0];
            }
          }
          blocks = blocks.slice(0, count).map(x => this.getPieceId(x));
          let blockText = getPieceList(blocks);
          let area;

          if (bapd.Count >= 13) {
            let count = bapd.Count - 12;
            area = getArea(x, y, w, h);
            text = `将${area.text}随机${count}个方块变成下列方块：${blockText}`;
          } else if (bapd.Count == 1) {
            let patternGrid = isRandomArea ? new Grid(w, h) : new Grid(6, 6);
            let ox = isRandomArea ? 0 : x;
            let oy = isRandomArea ? 0 : y;
            if (ox + w >= 6) ox = 6 - w;
            if (oy + h >= 6) oy = 6 - h;
            for (let iy = 0; iy < h; iy++) {
              for (let ix = 0; ix < w; ix++) {
                let block = blocks[iy * w + ix];
                if (block) patternGrid.set(ix + ox, iy + oy, block);
              }
            }
            patternFigure = patternGrid.toTable(cellSize);
            area = getArea(x, y, w, h);
            text = `将${area.text}方块变成如图所示的形状：${blockText}`;
          } else if (bapd.Count >= 0) {
            let count = bapd.Count || 1;
            area = getArea(6, 6, w, h);
            text = `将${area.text}随机${count}个方块变成下列方块：${blockText}`;
          }
          areaFigure = area.area?.toTable(cellSize);
          shapeFigure = area.shape?.toTable(cellSize);
        }

        list.push([
          i + 1,
          areaFigure ?? '',
          patternFigure ?? shapeFigure ?? '',
          text, //+ `<br>x=${x},y=${y},w=${w},h=${h},c=${bapd.Count}`,
        ]);
      }

      if (list.length > 0) {
        html += databook.component.create({
          type: 'list',
          columns: [{
            width: '8%',
            header: '序号'
          }, {
            width: '140px',
            header: '影响范围'
          }, {
            width: '140px',
            header: '图案',
            style: 'vertical-align: middle',
          }, {
            header: '干扰',
            align: 'left'
          }],
          list: list,
          hover: false,
          card: true,
        });
      }
    }
    return html;
  }


}

class Grid {
  constructor(width = 6, height = 6) {
    this.array = new Array(height).fill().map(x => new Array(width).fill().map(y => []));
  }

  fill(x, y, w, h, item) {
    for (let iy = 0; iy < 6; iy++) { // imp
      for (let ix = 0; ix < 6; ix++) {
        let b = ((ix >= x) && (ix < x + w) && (iy >= y) && (iy < y + h));
        if (b) {
          this.array[iy][ix].push(item);
        }
      }
    }
  }

  set(x, y, item) {
    this.array[y][x].push(item);
  }

  toTable(size = 16, caption = '') {
    let html = `<table class="p-grid">`;
    if (caption) html += `<caption>${caption}</caption>`;
    html += '<tbody>';
    for (let iy = 0; iy < this.array.length; iy++) {
      html += '<tr>';
      for (let ix = 0; ix < this.array[iy].length; ix++) {
        html += `<td style="width:${size}px;height:${size}px;">`;
        for (let piece of this.array[iy][ix]) {
          html += getPiece(piece, size);
        }
        html += '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

}


function getArea(x, y, w, h) {
  let rx = (x == 6) ? 0 : Math.min(x, 6 - w);
  let ry = (y == 6) ? 0 : Math.min(y, 6 - h);
  let rw = (x == 6) ? 6 : w;
  let rh = (y == 6) ? 6 : h;
  let areaGrid = new Grid(6, 6);
  areaGrid.fill(0, 0, 6, 6, 'default');
  areaGrid.fill(rx, ry, rw, rh, 'area');

  let shapeGrid;
  if ((x == 6 || y == 6) && (w * h < 36)) {
    shapeGrid = new Grid(w, h);
    //shapeGrid.fill(0, 0, w, h, 'area');
  }

  let text;
  if (x == 6 && y == 6) {
    text = (w == 6 && h == 6) ? '' : `随机${w}×${h}区域里的`;
  } else if (x == 6) {
    text = `第${ry + 1}-${ry + h + 1}行随机${w}×${h}区域里的`;
  } else if (y == 6) {
    text = `第${rx + 1}-${rx + w + 1}列随机${w}×${h}区域里的`;
  } else {
    text = (w == 1 && h == 1)
      ? `${"ABCDEF"[rx]}${ry + 1}`
      : `${"ABCDEF"[rx]}${ry + 1}:${"ABCDEF"[rx + w - 1]}${ry + h}区域里的`;
  }

  return {
    area: areaGrid,
    shape: shapeGrid,
    text,
  };
}

function getPiece(name, size, withName = false, link = false) {
  let piece;
  if (name in pieceNames) {
    piece = `<img src="./images/puzzle/${name}.png" style="width:${size}px;" title="${pieceNames[name]}" />`;
    if (withName) piece += pieceNames[name];
  } else {
    let pokemon = poketoru.pokemon[name];
    piece = pokemon.getSprite(size);
    if (withName) piece += pokemon.fullname;
    if (link) {
      piece = `<a href="#!/pokemon?id=${name}">${piece}</a>`;
    }
  }
  return piece;
}

async function init(...types) { // main, extra, event
  let modules = {
    'BossAction': './data/BossAction.json',
    'BossActionPokemonData': './data/BossActionPokemonData.json',
    'BossActionStageLayout': './data/BossActionStageLayout.json',
    'PokemonSet': './data/PokemonSet.json',
    'ItemPattern': './data/ItemPattern.json',
    'StageDropItem': './data/StageDropItem.json',
  };

  if (types.includes('main')) {
    modules['StageData'] = `./data/StageData.json`;
    modules['StageLayout'] = `./data/StageLayout.json`;
  }
  if (types.includes('extra')) {
    modules['StageDataExtra'] = `./data/StageDataExtra.json`;
    modules['StageLayoutExtra'] = `./data/StageLayoutExtra.json`;
  }
  if (types.includes('event')) {
    modules['StageDataEvent'] = `./data/StageDataEvent.json`;
    modules['StageLayoutEvent'] = `./data/StageLayoutEvent.json`;
  }

  await poketoru.data.load(modules);

  if (types.includes('main')) {
    stages.push(...poketoru.data.get('StageData').map((data, i) => new Stage(data, 'main', i)).slice(1));
  }
  if (types.includes('extra')) {
    stages.push(...poketoru.data.get('StageDataExtra').map((data, i) => new Stage(data, 'extra', i)));
  }
  if (types.includes('event')) {
    stages.push(...poketoru.data.get('StageDataEvent').map((data, i) => new Stage(data, 'event', i)));
  }

  databook.util.addCSS(`
    .p-grid-wrapper {
      max-height: 512px;
      overflow:auto;
      display: flex;
      flex-direction: column-reverse;
      resize: vertical;
    }
    .p-grid-border {
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 12px;
      margin: auto;
    }
    
    .p-grid {
      position: relative;
      margin: auto;
      padding: 0;
      border: none;
      background: none;
      user-select: none;
    }
    .p-grid + .p-grid {
      margin-top: 16px;
    }

    .p-grid caption {
      position: absolute;
      bottom: 4px;
      right: 0px;
      transform: translateX(100%);
      font-size: xx-small;
      padding: 0;
      margin: 0;
      display: block;
      width: 16px;
      text-align: center;
    }

    .p-grid td {
      border: 1px solid #ddd;
      position: relative;
      overflow: hidden;
      padding: 0;
      background: white;
    }

    .p-grid .p-sprite,
    .p-grid img
     {
      display: block !important;
      position: absolute;
      top: 0;
      left: 0;
    }
  `);
}

function getPieceList(blocks) {
  let pieceIds = [...new Set(blocks.filter(x => x))];
  pieceIds = pieceIds
    .map(x => ({
      id: x,
      sort: typeof x === 'string' ? Object.keys(pieceMap).findIndex(y => pieceMap[y] === x) + 10000 : x
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.id);
  let pieceCounts = pieceIds.map(x => blocks.filter(y => y == x).length);
  let text = '';
  //text += '<ul>';
  for (let i = 0; i < pieceIds.length; i++) {
    let piece = getPiece(pieceIds[i], 20, true, true);
    text += `<div>${pieceCounts[i]} × ${piece}</div>`;
  }
  //text += '</ul>';
  return text;
}

/*
Drop1Probabirity: 3
Drop1type: 32
Drop2Probabirity: 4
Drop2type: 32
Drop3Probabirity: 5
Drop3type: 32
*/

const getStage = function (type, id) {
  return stages.find(x => x.type == type && x.id == id);
};

const getStages = function (type) {
  return stages.filter(x => x.type == type);
};

export default {
  init,
  getStage,
  getStages,
};
