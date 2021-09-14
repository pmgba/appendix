const storage = {};
let version = '';

const load = async function (dict) {
  let promises = [];
  let options = {};
  if (version) {
    options.version = version;
  }

  Object.entries(dict).forEach(([key, value]) => {
    let promise = databook.loader.getCachedJSON(value, options).then(json => storage[key] = json);
    promises.push(promise);
  });
  return Promise.all(promises);
}

const get = function (name, value) {
  if (value === undefined) {
    return storage[name];
  }
  else {
    return storage[name][value];
  }
};

const setVersion = function(ver) {
  version = ver;
}

export default {
  load,
  get,
  setVersion,
}