import Game from '../assets/pmbase/game.mjs';

const version = '1.13.1';

const loaderModules = {
  'pokemon': {
    'PokemonData': './data/PokemonData.json',
    'PokemonType': './data/PokemonType.json',
    'PokemonAttack': './data/PokemonAttack.json',
    'PokemonLevel': './data/PokemonLevel.json',
    'pokemon.keys': './images/pokemon.keys.json',
    'MegaEvolution': './data/MegaEvolution.json',

    'MessagePokemonList': './text/zh-CN/MessagePokemonList.json',
    'MessagePokemonType': './text/zh-CN/MessagePokemonType.json',
  },

  'ability': {
    'PokemonAbility': './data/PokemonAbility.json',
    'MessagePokedex': './text/zh-CN/MessagePokedex.json',
  },

  'item': {
    'ItemData': './data/ItemData.json',
    'items.keys': './images/items.keys.json',
  },

};

class Poketoru extends Game {
  pokemon;
  abilities;
  items;

  constructor() {
    super();
  }

  async init(...moduleNames) {
    this.database.setVersion(version);

    let modules = {};
    for (let n of moduleNames) {
      Object.assign(modules, loaderModules[n]);
    }
    await this.database.load(modules);

    if (moduleNames.includes('pokemon')) {
      this.pokemon = this.database.get('PokemonData').map((data, i) => new Pokemon(data, i));
      this.sprite.add('pokemon', {
        url: './images/pokemon.sprite.jpg',
        width: 60,
        height: 60,
        col: 30,
        keys: this.database.get('pokemon.keys')
      });
    }

    if (moduleNames.includes('ability')) {
      this.abilities = this.database.get('PokemonAbility').map((data, i) => new Ability(data, i));
    }

    if (moduleNames.includes('item')) {
      this.items = this.database.get('ItemData').map((data, i) => new Item(data, i));
      this.sprite.add('item', {
        url: './images/items.sprite.png',
        width: 32,
        height: 32,
        col: 10,
        keys: this.database.get('items.keys')
      });
    }
  }

  getType(type) {
    let data = poketoru.database.get('PokemonType', type);
    let text = poketoru.database.get('MessagePokemonType', data.NameIndex).Text;
    return text;
  }

}

class Pokemon {
  #data;

  constructor(pokemonData, id) {
    this.#data = pokemonData;

    this.id = id;
    this.abilities = [pokemonData.Ability, ...pokemonData.MutableAbility].filter(x => x > 0);
    this.dex = pokemonData.DexNumber.toString().padStart(3, '0');
    this.name = poketoru.database.get('MessagePokemonList', pokemonData.NameIndex).Text;
    this.fullname = this.name + (pokemonData.FormIndex ? `～${poketoru.database.get('MessagePokemonList', pokemonData.FormIndex).Text}～` : '');
    this.type = pokemonData.Type;

    if (pokemonData.IsMega) {
      this.isMega = true;
      this.megaSpeed = pokemonData.MegaSpeed;
      this.msu = pokemonData.MegaSkillUpUseMax;

      var descIndex = poketoru.database.get('MegaEvolution', pokemonData.Ability).DescIndex;
      this.megaEffect = poketoru.database.get('MessagePokedex', descIndex).Text.replace('{megaName}', this.name);
    }
    else {
      this.rml = pokemonData.LevelLimitUpperUseMax;
      this.maxLevel = 10 + this.rml;
      this.group = pokemonData.Group;
      this.rank = pokemonData.Rank;
    }
  }

  getSprite(size) {
    return poketoru.sprite.get('pokemon', this.#data.LargeIconName, size ?? null, this.name);
  }

  getMega() {
    let targets = [];
    if (this.#data.EvoTarget1 > 0) {
      targets.push(this.#data.EvoTarget1);
    }
    if (this.#data.EvoTarget2 > 0) {
      if (this.#data.DexNumber == 6 || this.#data.DexNumber == 150) {
        targets.push(this.#data.EvoTarget1 + 1); // ugly trick
      }
      else {
        targets.push(this.#data.EvoTarget2);
      }
    }
    let megas = targets.filter(x => poketoru.pokemon[x].isMega);
    return megas;
  }

  getAtk(level) {
    return poketoru.database.get('PokemonAttack', level - 1)[this.group - 1];
  }

}

class Ability {
  #data;

  constructor(abilityData, id) {
    this.#data = abilityData;

    this.id = id;
    this.name = poketoru.database.get('MessagePokedex', abilityData.NameIndex)?.Text;
    this.desc = poketoru.database.get('MessagePokedex', abilityData.DescIndex)?.Text;

    this.exp = abilityData.Exp;
    this.value = abilityData.Value;
    this.probabilities = [abilityData.Probability3, abilityData.Probability4, abilityData.Probability5];
    this.skillEffect = abilityData.SkillEffect;
    this.param = abilityData.Param;

    this.isFixedDamage = [17, 18, 49, 83].includes(id);
    this.isLucky = id == 72;
    this.isYell = [76, 159].includes(id);
  }

  getSkillPower(level = 1) {
    let power = (this.isFixedDamage || this.isLucky || this.isYell) ? 1 : this.value;
    if (level > 1 && this.#data.SkillEffect == 2) power *= this.#data.Param[level - 1];
    return power;
  }

}

class Item {
  constructor(itemData, id) {
    this.id = id;
    this.icon = itemData.Icon1;
    this.name = itemData.NameHash;
    this.desc = itemData.DescHash;
  }

  getSprite(size) {
    return poketoru.sprite.get('item', this.icon, size ?? null, this.name);
  }

}

window.poketoru = new Poketoru();

export default poketoru;