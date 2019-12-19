import { Cols, ResultPerBase } from './type';

export function isValid(value: number, validList: Array<Object>, option: string): boolean {
  let valid: boolean = true;
  // 入力有無
  if (!value) {
    console.log("please input `--" + option + "` option");
    valid = false;
  }
  // 範囲内判定
  if (valid && validList.indexOf(String(value)) == -1) {
    console.log("please input valid `--" + option + "` option");
    valid = false;
  }
  return valid;
};

const customRound = (target: any, decimal: number): number =>
  Math.round(Number(target) * Math.pow(10, decimal)) / Math.pow(10, decimal);

export function executeRoundSmallNum(results: Array<ResultPerBase>, idx: number, round2ndDcm: boolean, round3rdDcm: boolean, cols: Cols) {
  return doRoundDecimal(results, idx, round2ndDcm, round3rdDcm, 3, cols);
}

const sameAsDevide = (hitCntVal, batCntVal, nextHitCntVal, nextBatCntVal) => {
  let currentGcd = gcd(hitCntVal, batCntVal);
  let nextGcd = gcd(nextHitCntVal, nextBatCntVal);

  return (
    hitCntVal / currentGcd == nextHitCntVal / nextGcd &&
    batCntVal / currentGcd == nextBatCntVal / nextGcd
  );
};

const doRoundDecimal = (
  results: Array<ResultPerBase>,
  idx: number,
  round2ndDecimal: boolean,
  round3rdDecimal: boolean,
  baseDecimal: number,
  cols: Cols
) => {
  const { cntCol, allCol, targetCol } = cols;
  let cntVal: string = results[idx][cntCol];
  let allVal: string = results[idx][allCol];
  let targetVal: string = results[idx][targetCol];

  idx = Number(idx);
  let nextIdx: number = idx + 1 < results.length ? idx + 1 : idx,
    rounded: number = customRound(targetVal, baseDecimal),
    roudedDecimal: number = baseDecimal;

  // 小数点第4位での四捨五入フラグがONの場合
  if (round2ndDecimal) {
    // 次の打者の値と小数点3位を四捨五入した値が違う場合、フラグをfalseに戻す
    if (rounded != customRound(results[nextIdx][targetCol], baseDecimal)) {
      round2ndDecimal = false;
    }

    if (round3rdDecimal) {
      rounded = customRound(targetVal, baseDecimal + 2);
      roudedDecimal = baseDecimal + 2;
      round3rdDecimal = false;
    } else {
      // 小数点第4位での四捨五入
      rounded = customRound(targetVal, baseDecimal + 1);
      roudedDecimal = baseDecimal + 1;
      round3rdDecimal = false;

      if (
        rounded == customRound(results[nextIdx][targetCol], baseDecimal + 1) &&
        allVal != results[nextIdx][allCol]
      ) {
        round3rdDecimal = true;
        // 小数点第3位での四捨五入
        rounded = customRound(targetVal, baseDecimal + 2);
        roudedDecimal = baseDecimal + 2;
      }
    }
  } else {
    // 次の打者の値と小数点3位を四捨五入した値が同じ場合
    if (rounded == customRound(results[nextIdx][targetCol], baseDecimal)) {
      // 本数・打数のどちらかが違う and 約分したら同じ比率にならない場合、小数点第2位で四捨五入させ、次の順位も同様に四捨五入させるフラグをtrue
      if (
        !(
          (results[nextIdx][cntCol] == cntVal &&
            results[nextIdx][allCol] == allVal) ||
          sameAsDevide(
            cntVal,
            allVal,
            results[nextIdx][cntCol],
            results[nextIdx][allCol]
          )
        )
      ) {
        rounded = customRound(targetVal, baseDecimal + 1);
        round2ndDecimal = true;
        roudedDecimal = baseDecimal + 1;
        // 全く同じ場合、次に違う選手が出てくるまでチェック
      } else {
        for (let idxNext = idx + 2; idxNext < results.length; idxNext++) {
          // 本数・打席数が異なる選手がある場合
          if (
            !(
              (results[idxNext][cntCol] == cntVal &&
                results[idxNext][allCol] == allVal) ||
              sameAsDevide(
                cntVal,
                allVal,
                results[nextIdx][cntCol],
                results[nextIdx][allCol]
              )
            )
          ) {
            // 小数点3位で四捨五入した結果を比較し、同じ場合、小数点4位にしてフラグtrue
            if (
              rounded == customRound(results[idxNext][targetCol], baseDecimal)
            ) {
              rounded = customRound(targetVal, baseDecimal + 1);
              round2ndDecimal = true;
              roudedDecimal = baseDecimal + 1;
              break;
            }
          }
        }
      }
    }
  }

  rounded = addedZero(rounded, roudedDecimal);
  // create flugs
  let isIntPartOne = String(rounded).slice(0, 1) == "1";
  let isOps = targetCol == RATE_TYPE_COL_OPS;

  if (baseDecimal == 3) {
    // OPS以外 (when rounded = 1. then output as 1.000)
    if (isIntPartOne && !isOps) {
      rounded = "1.000";
      // OPS (1を超える場合があるため、1未満のみ`0`を削除)
    } else if (!isIntPartOne) {
      rounded = String(rounded).slice(1);
    }
  }

  return {
    rounded,
    flag2: round2ndDecimal,
    flag3: round3rdDecimal
  };
};

