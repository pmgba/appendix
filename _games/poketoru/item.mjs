import poketoru from './poketoru.mjs';

function createContent() {
  let html = '';

  html += databook.component.create({
    type: 'list',
    list: poketoru.items.map(x=>[
      x.getSprite(),
      x.icon
    ]),
    card: true,
  });
  
  return {
    content: html,
  };
}

export default {

  title: "道具",

  init: async () => {
    await poketoru.init('item');
  },

  getContent: createContent,

};



