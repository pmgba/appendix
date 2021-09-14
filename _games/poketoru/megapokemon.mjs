import poketoru from './poketoru.mjs';

export default {

  title: "宝可梦",

  init: async () => {
    await poketoru.init('pokemon', 'ability');
  },

  getContent: (search) => {
    let megaList = poketoru.pokemon
      .filter(data => data.isMega)
      .sort((a, b) => a.dex - b.dex)
      .map((data) => [
        data.getSprite(24),
        data.dex,
        data.name,
        poketoru.getType(data.type),
        data.megaEffect,
        data.megaSpeed,
        '-',
        data.msu,
        '-',
        data.megaSpeed - data.msu,
      ]);
        
    let html = databook.component.create({
      type: 'list',
      columns: [ '图标', '编号' ],
      list: megaList,
      card: true,
      small: true,
    });

    return {
      content: html,
    };
  },
};
/*
function init() {
  Object.keys( poketoru.megaList )
    .map( megaID => poketoru.getMegaData(megaID) )
    .sort(function(pkmn1, pkmn2) {
      return pkmn1.dex - pkmn2.dex || pkmn1.form - pkmn2.form;
    })
    .forEach( megaData => {
      let pkmnData = poketoru.getPokemonData(megaData.originID);
      sumMSU += megaData.msu;
      list += `<tr>
        <td class="p-pkmn">${ poketoru.getPokemonIcon( pkmnData )}<i class="fas fa-arrow-right m-1"></i>${poketoru.getPokemonIcon( megaData ) }</td>
        <td>${ megaData.dex.toString().padStart(3,0) }</td>
        <td><a href="${pmBase.url.getHref( 'pokemon', megaData.id )}">${megaData.name}</a></td>
        <td>${ pmBase.content.create('type',megaData.type) }</td>
        <td>${ poketoru.getAttack( pkmnData.group, 1 )} - ${poketoru.getAttack( pkmnData.group, pkmnData.rml + 10 ) }</td>
        <td class="text-left">${ poketoru.getMegaEffect(megaData) }</td>
        <td data-text="${megaData.ms - megaData.msu}">${megaData.ms} - ${megaData.msu} = ${megaData.ms - megaData.msu}</td>
      </tr>`;
    });
  
  let header = [
    '图标',
    '编号',
    '宝可梦',
    '属性',
    '攻击力',
    '超级效果',
    '进化速度',
  ];
  pmBase.content.build({
    pages: [{
        content: pmBase.content.create('sortlist',list,header),
    }],
  });
  popover.apply();
};


pmBase.hook.on( 'load', init );
*/