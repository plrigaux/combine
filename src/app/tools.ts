function factorial(num: number) {
    let rval = 1;
    for (let i = 2; i <= num; i++)
        rval = rval * i;

    return rval;
}

function factorialFrom(num: number, start: number) {
    let rval = 1;

    for (let i = start; i <= num; i++) {
        rval = rval * i;
    }

    return rval;
}


function* combinationsList(n: number, k: number): IterableIterator<number[]> {
    if (k < 1) {
        yield [];
    } else {
        for (let i = k; i <= n; i++) {
            for (let tail of combinationsList(i - 1, k - 1)) {
                tail.push(i);
                yield tail;
            }
        }
    }
}

export function generateCombinationsList(n: number, k: number): number[][] {

    let results: number[][] = []
    let result: number[] = new Array(k)

    combinationsList2x(n, k, 0, result, results)
    return results
}

function combinationsList2x(n: number, len: number, startPosition: number, result: number[], allResuls: number[][]) {
    if (len == 0) {
        //console.log(result)
        allResuls.push([...result])
        return;
    }

    for (let i = startPosition; i <= n - len;) {
        i++
        result[result.length - len] = i;
        combinationsList2x(n, len - 1, i, result, allResuls);
    }
}

function getMaxes(n: number, k: number): number[] {
    let maxes: number[] = []

    for (let i = n - k; i < n;) {
        maxes.push(++i)
    }
    return maxes
}

function getAllNum(n: number, k: number): number[] {
    let maxes: number[] = []

    for (let i = 1; i <= n; i++) {
        maxes.push(i)
    }
    return maxes
}

export function getCombinationIndex(comb: number[], n: number, k: number, prev: number, idx: number): number {

    if (idx >= comb.length) {
        return 1
    }

    let original_ball = comb[idx]
    let ball = original_ball - prev
    let nextK = k - 1

    let index = 0
    for (let i = (n - ball + 1); i < n; i++) {
        index += combinationsNum(i, nextK)
    }

    index += getCombinationIndex(comb, n - ball, nextK, original_ball, idx + 1)

    return index
}

function getCombIndex1(comb: number[], n: number, k: number): number {
    let index = 0
    /*
      for (let i = 0; i <= comb.length; i++) {
        let ball = comb[i]
      }
    */
    let j = 0

    for (let i = 1; i <= n; i++) {
        let ball = comb[j++]

        let jump = ball - i

        if (!jump) {
            continue;
        }

        let combof_below: number = combinationsNum(n - 1, jump - 1)
        index += combof_below
        console.log(combof_below)

        if (j >= comb.length) {
            break;
        }
    }

    return index
}

export function combinationsNum(n: number, r: number): number {
    let num = factorialFrom(n, n - r + 1)
    let den = factorial(r)

    let val = num / den

    return val
}


function combinations(n: number, k: number): number {
    let num = factorial(n)
    let den = factorial(k) * factorial(n - k)
  
    let val = num / den
    //console.log(num , den, "  ", val)
    return val
  
  }
  
  function combinationsFaster(n: number, k: number): number {
    let num = factorialFrom(n, n - k + 1)
    let den = factorial(k)
  
    let val = num / den
  
    return val
  }
  
  export function getCombinationfromIndex(n: number, k: number, index: number) {
    let c = combinationsFaster(n, k)

    if (index > c) {
      console.error("out", c, index)
      return
    }

    console.log("combinations", c, index)
    let result: number[] = []
    _getCombinationfromIndex(n, k, index, 0, result, 1)

    console.log("res idx", index, result)
  }

  function _getCombinationfromIndex(n: number, k: number, id: number, base: number, result: number[], level: number) {

    if (k == 1) {
      //console.warn("n", n - 1, r - 1, base, id)
      result.push(id - base + level - 1)
      return
    }

    let combof_below: number = combinationsFaster(n - 1, k - 1)
    //console.log("base", base, "c", combof_below, "id", id, "n", n, "r", r, "lvl", level, result)

    if (id <= combof_below + base) {
      result.push(level)
      //console.log("lower")
      _getCombinationfromIndex(n - 1, k - 1, id, base, result, level + 1)
    } else {
      //console.log("upper")
      _getCombinationfromIndex(n - 1, k, id, base + combof_below, result, level + 1)
    }
  }