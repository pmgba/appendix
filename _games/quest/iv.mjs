import quest from './quest.mjs';

function calc() {
  const pi = parseInt(document.querySelector('.calc__pokemon').value, 10);
  const lv = parseInt(document.querySelector('.calc__level').value, 10);
  const hp = parseInt(document.querySelector('.calc__hp').value, 10);
  const atk = parseInt(document.querySelector('.calc__atk').value, 10);

  const data = quest.database.get('pokemonDataSet').m_datas[pi];
  const bsHp = data.m_hpBasis;
  const bsAtk = data.m_attackBasis;

  const ivHp = hp - bsHp - lv;
  const ivAtk = atk - bsAtk - lv;

  document.querySelector('.calc__hpresult').value = ivHp;
  document.querySelector('.calc__atkresult').value = ivAtk;
}

export default {

  title: "宝可梦",

  init: async () => {
    await quest.database.load({
      'pokemonDataSet': './data/auto/pokemon/PokemonDataSet.json',
      'monsname': './text/zh-Hans/monsname.json',
    });
  },

  content: () => {
    const select = quest.database.get('pokemonDataSet').m_datas
      .map(pokemonData => [
        `<option value="${pokemonData.m_monsterNo}">${quest.getNumber(pokemonData.m_monsterNo)} ${quest.database.get('monsname', pokemonData.m_monsterNo)}</option>`
      ]).join();

    const html = `
    <form>
<div class="row">
<div class="col-12 col-md-12">
  <div class="card card-primary border-primary">
    <div class="card-header with-border border-primary bg-primary">个体值计算器</div>
    <div class="card-body card-profile text-center">
      <div class="row">
        <div class="col-12 col-lg-6">
          <div class="form-group row">
            <label class="col-4 control-label">宝可梦</label>
            <div class="col-8"><select class="form-control calc__pokemon" name="calc-type">${select}</select></div>
          </div>
          <div class="form-group row">
            <label class="col-4 control-label">等级</label>
            <div class="col-8"><input type="text" class="form-control calc__level" value="0" ></div>
          </div>
          <div class="form-group row">
            <label class="col-4 control-label">HP</label>
            <div class="col-8"><input type="text" class="form-control calc__hp" value="0" ></div>
          </div>
          <div class="form-group row">
            <label class="col-4 control-label">Atk</label>
            <div class="col-8"><input type="text" class="form-control calc__atk" value="0" ></div>
          </div>
          <hr />
          <div class="form-group row">
            <label class="col-4 control-label"></label>
            <div class="col-8"><button type="button" class="btn btn-primary m-1 calc__ok">计算</button></div>
          </div>
        </div>
        <div class="col-12 col-lg-6 calc__resultcontainer" style="overflow-y: auto;max-height: 500px;">
          <div class="form-group row">
            <label class="col-4 control-label">HP个体值</label>
            <div class="col-8"><input type="text" class="form-control calc__hpresult" value="0" ></div>
          </div>
          <div class="form-group row">
            <label class="col-4 control-label">Atk个体值</label>
            <div class="col-8"><input type="text" class="form-control calc__atkresult" value="0" ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</form>
    `;
    
    const $html = databook.util.parseHTML(html)[0];
    $html.querySelector('.calc__ok').onclick = calc;

    return {
      title: '个体值计算器',
      content: $html,
    };
  },
};