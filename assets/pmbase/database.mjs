const storage = {};
let version = '';

const load = async function (obj) {
  let promises = [];
  let options = {};
  if (version) {
    options.version = version;
  }

  let keyvaluepairs = [];
  if (typeof obj === 'string') {
    keyvaluepairs = [...arguments];
  } else if (Array.isArray(obj)) {
    keyvaluepairs = obj.map(x => [x, x]);
  } else if (typeof obj === 'object') {
    keyvaluepairs = [...Object.entries(obj)];
  }

  keyvaluepairs.forEach(([key, value]) => {
    if (key in storage) return;
    let promise = databook.loader.getJson(value).then(json => storage[key] = json);
    promises.push(promise);
  });

  await Promise.all(promises);

  return keyvaluepairs.map(x => storage[x[0]]);
}

const get = function (name, value) {
  if (value === undefined) {
    return storage[name];
  }
  else {
    return storage[name][value];
  }
};

const set = function (name, value) {
  storage[name] = value;
};

const setVersion = function(ver) {
  version = ver;
}

export default {
  load,
  get,
  set,
  setVersion,
}