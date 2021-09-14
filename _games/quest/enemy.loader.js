import stoneData from './data/enemystone.js';
import {enemyPack} from './data/stagedata.js';
import enemyData from './data/enemydata.js';
import moveData from './data/movedata.js';

pmBase.util.arr2obj(
  enemyData,
  ["hpBasis","attackBasis","dropType","skillIDs","skillStoneIDs","passiveStoneIDs"],
  function( key, data ) {
    data['monsterNo'] = key.split('.')[0];
    return data;
  }
);

export {
  stoneData,
  enemyData,
  enemyPack,
  moveData,
};