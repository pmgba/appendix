class PokemonId {
  static #pattern = /(\d+)(?:([^\d])(\d+)){0,1}/;

  number = 0;
  form = 0;

  constructor(number, form) {
    if (typeof number === "number") {
      this.number = number;
    } else if (typeof number === "string") {
      const m = number.match(PokemonId.#pattern);
      if (m != null) {
        this.number = ~~m[1];
        this.form = ~~m[3];
      }
    }

    if (typeof form === "number") {
      this.form = form;
    }
  }

  isValid() {
    return this.number > 0;
  }

  toString() {
    return this.number.toString().padStart(4, '0') + '-' + this.form.toString().padStart(3, '0');
  }

  static parse(text) {
    if (text == null) {
      return null;
    }

    const m = text.match(this.#pattern);
    if (m) {
      return new PokemonId(~~m[1], ~~m[3]);
    }

    return null;
  }
}

export default PokemonId;