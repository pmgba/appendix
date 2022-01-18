import quest from './quest.mjs';

function calc() {
  let pi = parseInt($('.calc__pokemon').val(), 10);
  let lv = parseInt($('.calc__level').val(), 10);
  let hp = parseInt($('.calc__hp').val(), 10);
  let atk = parseInt($('.calc__atk').val(), 10);

  let data = quest.data.get('pokemonDataSet').m_datas[pi];
  var bsHp = data.m_hpBasis;
  var bsAtk = data.m_attackBasis;

  var ivHp = hp - bsHp - lv;
  var ivAtk = atk - bsAtk - lv;

  $('.calc__hpresult').val(ivHp);
  $('.calc__atkresult').val(ivAtk);
}

export default {

  title: "宝可梦",

  init: async () => {
    await quest.data.load({
      'pokemonDataSet': './data/auto/pokemon/PokemonDataSet.json',
      'monsname': './text/zh-Hans/monsname.json',
    });
  },

  getContent: () => {
    let select = quest.data.get('pokemonDataSet').m_datas
      .map(pokemonData => [
        `<option value="${pokemonData.m_monsterNo}">${quest.getNumber(pokemonData.m_monsterNo)} ${quest.data.get('monsname', pokemonData.m_monsterNo)}</option>`
      ]).join();

    let html = `
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
    `;
    
    let $html = $(html);
    $('.calc__ok', $html).click(calc);

    return {
      title: '个体值计算器',
      content: $html,
    };
  },
}