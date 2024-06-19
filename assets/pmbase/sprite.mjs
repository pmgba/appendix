const modules = {
  default: {
    url: '',
    width: 0,
    height: 0,
    col: 0,
    keys: [],
  }
};

const add = function (key, module) {
  modules[key] = module;
};

const get = function (key, value, displayWidth, title) {
  if (!(key in modules)) return '';

  let module = modules[key];

  let index = value;
  if (module.keys) {
    index = module.keys.indexOf(value) || 0;
  } else if (module.toIndex) {
    index = module.toIndex(value);
  }

  let scale = displayWidth ? displayWidth / module.width : 1;
  let width = module.width * scale;
  let height = module.height * scale;
  let x = width * (index % module.col);
  let y = height * Math.floor(index / module.col);
  let bgWidth = module.width * scale * module.col;
  let wrapperStyle = `
    height: ${height}px;
    width: ${width}px;
  `;
  let iconStyle = `
      background:url(${module.url}) no-repeat -${x}px -${y}px;
      background-size: ${bgWidth}px auto;
      height: ${height}px;
      width: ${width}px;
    `;

  if (module.crop) {
    wrapperStyle = `
      height: ${module.crop[2]}px;
      width: ${module.crop[3]}px;
    `;
    iconStyle += `
      position: relative;
      left: -${module.crop[0]}px;
      top: -${module.crop[1]}px;
    `;
  }

  if (module.style) {
    wrapperStyle += opt.style;
  }

  let html = `<div class="p-sprite" data-value="${value}" title="${title ?? value}" style="display: inline-block; vertical-align:bottom; ${wrapperStyle}">
    <div class="p-sprite__icon" style="${iconStyle}"></div></div>`;

  return html;
};

export default {
  add,
  get,
};