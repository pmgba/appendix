import './core.js';
import { stoneData, enemyData, moveData } from './enemy.loader.js';

function init() {
  pmBase.database.add('monsname', '../../swsh/text/monsname.json');
  pmBase.database.add('typename', '../../swsh/text/typename.json');

  pmBase.database.load(function () {

    let selector = {};
    $.each(enemyData, function (key, data) {
      let name = pmBase.database.get("monsname", ~~data.monsterNo);
      selector[key] = `${data.monsterNo} ${name} (${data.hpBasis})`;
    });

    pmBase.content.build({
      pages: [{
        selector: selector,
        content: selectenemy,
      }],
    });

  });
}

function selectenemy(hash) {
  if (hash.isEmpty) return;
  let key = hash.value;
  let data = enemyData[key];
  let name = pmBase.database.get("monsname", ~~data.monsterNo);

  $('.c-enemyData__icon').html(pmBase.sprite.get('pokemon', data.monsterNo));
  $('.c-enemyData__name').html(name);
  $('.c-enemyData__hp').html(data.hpBasis);
  $('.c-enemyData__atk').html(data.attackBasis);

  let html = '';
  $.each(data.skillIDs, function (i, skillID) {
    if (skillID == -1) return;
    let sData = moveData[skillID];
    html += `
        <tr>
          <td>${pmBase.sprite.get('skill', sData.icon)}</td>
          <td>${sData.name}</td>
          <td>${sData.desc}</td>
          <td>${Math.round(sData.damage * 100)}</td>
          <td>${sData.charge}</td>
    `;
    let attrs = [];
    for (let j = 0; j <= 2; j++) {
      let stoneID = data.skillStoneIDs[i * 3 + j];
      if (stoneID > -1) attrs.push(...stoneData[stoneID].filter(Boolean));
    }
    attrs.sort();
    html += '<td class="small text-nowrap">';
    html += attrs.join('<br>');
    html += '</td>';
    html += '</tr>';
  });
  if (html.length == 0) html = '<td colspan="100">没有招式</td>';
  $('.c-enemyData__skills tbody').html(html);

  html = '';
  for (let i = 0; i <= 3; i++) {
    let stoneID = data.passiveStoneIDs[i];
    if (stoneID == -1) {
      html += '<td>-</td>';
    } else {
      html += `<td>${stoneData[stoneID].join('<br>')}</td>`;
    }
  }
  $('.c-enemyData__passive tbody').html(html);
}

pmBase.hook.on('load', init);