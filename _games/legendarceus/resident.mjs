const mapNames = [
  "祝庆村",
  "黑曜原野",
  "红莲湿地",
  "群青海岸",
  "天冠山麓",
  "纯白冻土",
];

const layerNames = {
  "encounter": "野生",
  "oybn": "头目",
  "event": "任务",
  "mass": "大量出现",
  "wormhole": "时空扭曲",
  "unnn": "未知图腾",
  "mkrg": "幽火",
  "searchitem": "挖宝",
  "poem": "古老诗文",
  "bandits": "野贼三姐妹",
};

function createMain() {
  let mapbuttons = '';
  for (let i = 1; i < 6; i++) {
    mapbuttons += `
    <label class="c-checkbutton">
      <input type="radio" name="options" ${i == 1 ? ' checked ' : ''} onclick="document.querySelector('.p-canvas').dataset['area']=${i};updateCanvas();">
      <span>${mapNames[i]}</span>
    </label>
    `;
  }
  let layerbuttons = '', layerhtml = '';
  Object.entries(layerNames).forEach(([key, value]) => {
    layerbuttons += `
    <label class="c-checkbutton">
      <input type="checkbox" onclick="document.querySelector('.p-canvas').classList.toggle('p-canvas--${key}');updateCanvas();">
      <span>${value}</span>
    </label>
    `;
    layerhtml += `<img class="p-canvas__layer p-canvas__${key}" />`;
  });

  var html = `
  <div class="row">
    <label class="col-sm-2">地图</label>
    <div class="col-sm-10">
      ${mapbuttons}
    </div>
  </div>
  <div class="row">
    <label class="col-sm-2">内容</label>
    <div class="col-sm-10">
      ${layerbuttons}
    </div>
  </div>

  <div class="row">
    <div class="col-sm-12">
      <div class="p-canvas"  data-area="1">
        <img class="p-canvas__layer p-canvas__background" />
        ${layerhtml}
      </div>
    </div>
  </div>
  `;

  return {
    content: html,
  };
}

window.updateCanvas = function () {
  let area = document.querySelector('.p-canvas').dataset["area"];
  document.querySelector('.p-canvas__background').src = `./images/resident/area0${area}.jpg`;
  Object.keys(layerNames).forEach(key => {
    document.querySelector(`.p-canvas__${key}`).src = `./images/resident/${key}.ha_area0${area}.png`;
  });
}

async function init() {

  let layercss = Object.keys(layerNames)
    .map(key=>`.p-canvas--${key} .p-canvas__${key},`)
    .join('');

  databook.util.addCSS(`
  .p-canvas {
    position: relative;
    height: 1025px;
    max-width: 100%;
  }
  .p-canvas__layer {
    all: unset;
    top: 0;
    left: 0;
    position: absolute;
    display: none;
    width: 100%;
  }

  ${layercss}
  .p-canvas__background 
  {
    display: block;
  }

  .c-checkbutton {
    margin-bottom: 1rem;
  }
  `);
}


export default {

  title: "分布",

  init: init,

  getContent: (search) => {
    return createMain();
  },

}