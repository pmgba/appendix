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
      headers: [
        '图标',
        '编号',
        '宝可梦',
        '属性',
        '超级进化效果',
      ],
      list: megaList,
      small: true,
    });

    return {
      content: html,
    };
  },
};