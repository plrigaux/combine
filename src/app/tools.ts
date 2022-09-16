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

export function getOddsIndex(combination: number[], n: number, k: number): number {
    return getCombinationIndex(combination, n, k, 0, 0)
}

function getCombinationIndex(combination: number[], n: number, k: number, prev: number, idx: number): number {

    if (idx >= combination.length) {
        return 1
    }

    let original_ball = combination[idx]
    let ball = original_ball - prev
    let nextK = k - 1

    let index = 0
    for (let i = (n - ball + 1); i < n; i++) {
        index += calculateOdds(i, nextK)
    }

    index += getCombinationIndex(combination, n - ball, nextK, original_ball, idx + 1)

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

        let combof_below: number = calculateOdds(n - 1, jump - 1)
        index += combof_below
        console.log(combof_below)

        if (j >= comb.length) {
            break;
        }
    }

    return index
}

export function calculateOdds(n: number, k: number): number {
    let num = factorialFrom(n, n - k + 1)
    let den = factorial(k)

    let val = num / den

    return val
}

export function getCombinationfromIndex(n: number, k: number, index: number): number[] {
    let odds = calculateOdds(n, k)

    if (index > odds) {
        console.warn("getCombinationfromIndex index > odds", index, odds)
        return []
    }

    console.log("combinations", odds, index)
    let result: number[] = []
    _getCombinationfromIndex(n, k, index, 0, result, 1)

    return result
}

function _getCombinationfromIndex(n: number, k: number, id: number, base: number, result: number[], level: number) {

    if (k == 1) {
        //console.warn("n", n - 1, r - 1, base, id)
        result.push(id - base + level - 1)
        return
    }

    let combof_below: number = calculateOdds(n - 1, k - 1)
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

export function angle() : number {

    const lat1 = 45.45601525767227
    const long1 = -73.54996188669251

    const lat2 = 40.7335166835945
    const long2 = -74.00306387532882

    const dy = lat2 - lat1;

    const dx = Math.cos(Math.PI / 180 * lat1) * (long2 - long1);
    const angle = Math.atan2(dy, dx);
    return angle
}