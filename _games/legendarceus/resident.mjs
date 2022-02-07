const mapNames = [
  "祝庆村",
  "黑曜原野",
  "红莲湿地",
  "群青海岸",
  "天冠山麓",
  "纯白冻土",
];

function createMain() {
  var mapbuttons = '';
  for(let i = 1; i < 6; i++){
    mapbuttons += `
    <label class="c-checkbutton">
      <input type="radio" name="options" onclick="document.querySelector('.p-canvas').dataset['area']=${i};updateCanvas();">
      <span>${mapNames[i]}</span>
    </label>
    `;
  }

  var html = `
  <form>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">地图</label>
    <div class="col-sm-10">
    <div class="btn-group btn-group-toggle" data-toggle="buttons">
    ${mapbuttons}
  </div>
    </div>
    </div>
    <div class="form-group row">
    <label class="col-sm-2 col-form-label">内容</label>
      <div class="col-sm-10">
        <div class="btn-group-toggle" data-toggle="buttons">
        <label class="c-checkbutton">
          <input type="checkbox" onclick="document.querySelector('.p-canvas').classList.toggle('p-canvas--encounter');updateCanvas();">
          <span>野生</span>
        </label>
        <label class="c-checkbutton">
          <input type="checkbox" onclick="document.querySelector('.p-canvas').classList.toggle('p-canvas--oybn');updateCanvas();"> 
          <span>头目</span>
        </label>
        <label class="c-checkbutton">
          <input type="checkbox" onclick="document.querySelector('.p-canvas').classList.toggle('p-canvas--event');updateCanvas();"> 
          <span>任务</span>
        </label>
        <label class="c-checkbutton">
          <input type="checkbox" onclick="document.querySelector('.p-canvas').classList.toggle('p-canvas--mass');updateCanvas();"> 
          <span>大量出现</span>
        </label>
        <label class="c-checkbutton">
          <input type="checkbox" onclick="document.querySelector('.p-canvas').classList.toggle('p-canvas--unnn');updateCanvas();"> 
          <span>未知图腾</span>
        </label>
        <label class="c-checkbutton">
          <input type="checkbox" onclick="document.querySelector('.p-canvas').classList.toggle('p-canvas--mkrg');updateCanvas();"> 
          <span>幽火</span>
        </label>
        </div>
      </div>
    </div>
  </form>

  <div class="row">
  <div class="col-sm-12">
  <div class="p-canvas"  data-area="0">
    <img class="p-canvas__layer p-canvas__background" />
    <img class="p-canvas__layer p-canvas__encounter" />
    <img class="p-canvas__layer p-canvas__mass" />
    <img class="p-canvas__layer p-canvas__oybn" />
    <img class="p-canvas__layer p-canvas__event" />
    <img class="p-canvas__layer p-canvas__unnn" />
    <img class="p-canvas__layer p-canvas__mkrg" />
  </div>
  </div>
  </div>
  `;
  
  return {
    content: html,
  };
}

window.updateCanvas = function ()
{
  let area = document.querySelector('.p-canvas').dataset["area"];
  document.querySelector('.p-canvas__background').src = `./images/resident/area0${area}.png`;
  document.querySelector('.p-canvas__encounter').src  = `./images/resident/encounter.ha_area0${area}.png`;
  document.querySelector('.p-canvas__oybn').src = `./images/resident/oyabun.ha_area0${area}.png`;
  document.querySelector('.p-canvas__event').src = `./images/resident/event.ha_area0${area}.png`;
  document.querySelector('.p-canvas__mass').src = `./images/resident/mass.ha_area0${area}.png`;
  document.querySelector('.p-canvas__unnn').src = `./images/resident/unown.ha_area0${area}.png`;
  document.querySelector('.p-canvas__mkrg').src = `./images/resident/mikaruge.ha_area0${area}.png`;
}

async function init() {
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

  .p-canvas--encounter .p-canvas__encounter,
  .p-canvas--oybn .p-canvas__oybn,
  .p-canvas--event .p-canvas__event,
  .p-canvas--mass .p-canvas__mass,
  .p-canvas--unnn .p-canvas__unnn,
  .p-canvas--mkrg .p-canvas__mkrg,
  .p-canvas__background 
  {
    display: block;
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