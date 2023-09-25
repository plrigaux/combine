function factorial (num: number) {
  let rval = 1
  for (let i = 2; i <= num; i++) rval = rval * i

  return rval
}

function factorialFrom (num: number, start: number) {
  let rval = 1

  for (let i = start; i <= num; i++) {
    rval = rval * i
  }

  return rval
}

function* combinationsList (n: number, k: number): IterableIterator<number[]> {
  if (k < 1) {
    yield []
  } else {
    for (let i = k; i <= n; i++) {
      for (let tail of combinationsList(i - 1, k - 1)) {
        tail.push(i)
        yield tail
      }
    }
  }
}

export function generateCombinationsList (n: number, k: number): number[][] {
  let results: number[][] = []
  let result: number[] = new Array(k)

  combinationsList2x(n, k, 0, result, results)
  return results
}

function combinationsList2x (
  n: number,
  len: number,
  startPosition: number,
  result: number[],
  allResuls: number[][]
) {
  if (len == 0) {
    //console.log(result)
    allResuls.push([...result])
    return
  }

  for (let i = startPosition; i <= n - len; ) {
    i++
    result[result.length - len] = i
    combinationsList2x(n, len - 1, i, result, allResuls)
  }
}

function getMaxes (n: number, k: number): number[] {
  let maxes: number[] = []

  for (let i = n - k; i < n; ) {
    maxes.push(++i)
  }
  return maxes
}

function getAllNum (n: number, k: number): number[] {
  let maxes: number[] = []

  for (let i = 1; i <= n; i++) {
    maxes.push(i)
  }
  return maxes
}

export function getOddsIndex (
  combination: number[],
  n: number,
  k: number,
  power_ball: number
): number {
  return getCombinationIndex(combination, n, k, power_ball, 0, 0)
}

function getCombinationIndex (
  combination: number[],
  n: number,
  k: number,
  power_ball: number,
  prev: number,
  idx: number
): number {
  if (idx >= combination.length) {
    return 1
  }

  let original_ball = combination[idx]
  let ball = original_ball - prev
  let nextK = k - 1

  let index = 0
  for (let i = n - ball + 1; i < n; i++) {
    index += calculateOdds(i, nextK, power_ball)
  }

  index += getCombinationIndex(
    combination,
    n - ball,
    nextK,
    power_ball,
    original_ball,
    idx + 1
  )

  return index
}

function getCombIndex1 (
  comb: number[],
  n: number,
  k: number,
  power_ball: number
): number {
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
      continue
    }

    let combof_below: number = calculateOdds(n - 1, jump - 1, power_ball)
    index += combof_below
    console.log(combof_below)

    if (j >= comb.length) {
      break
    }
  }

  return index
}

export function calculateOdds (
  n: number,
  k: number,
  power_ball: number = 1
): number {
  let num = factorialFrom(n, n - k + 1)
  let den = factorial(k)

  let val = num / den

  return val * power_ball
}

export class Result {
  main_pool: number[] = []
  power_ball: number = 1

  constructor (n: number, k: number, power_ball: number) {}
}

export function getCombinationfromIndex (
  n: number,
  k: number,
  power_ball: number,
  index: number
): Result {
  let odds = calculateOdds(n, k, power_ball)

  if (index > odds) {
    console.warn('getCombinationfromIndex index > odds', index, odds)
    index = index % odds
    //return new Result(n, k, power_ball)
  }

  console.log('combinations', odds, index)
  let result: Result = new Result(n, k, power_ball)

  const [ajusted_index, power_ball_result] = calculate_ajusted_index(
    n,
    k,
    power_ball,
    index
  )

  _getCombinationfromIndex(n, k, power_ball, ajusted_index, 0, result, 1)

  result.power_ball = power_ball_result

  console.log('combinations results', result)

  return result
}

function calculate_ajusted_index (
  n: number,
  k: number,
  power_ball: number,
  index: number
): [number, number] {
  let main_pool_odds = calculateOdds(n, k, 1)

  power_ball = 1
  while (index > main_pool_odds) {
    index -= main_pool_odds
    power_ball += 1
  }

  return [index, power_ball]
}

function _getCombinationfromIndex (
  n: number,
  k: number,
  power_ball: number,
  index: number,
  base: number,
  result: Result,
  level: number
) {
  if (k == 1) {
    //console.warn("n", n - 1, r - 1, base, id)
    result.main_pool.push(index - base + level - 1)
    return
  }

  let combof_below_no_power_ball: number = calculateOdds(n - 1, k - 1)
  //const combof_below: number = calculateOdds(n - 1, k - 1, power_ball)

  //console.log("base", base, "c", combof_below, "id", id, "n", n, "r", r, "lvl", level, result)

  if (index <= combof_below_no_power_ball + base) {
    result.main_pool.push(level)
    //console.log("lower")
    _getCombinationfromIndex(
      n - 1,
      k - 1,
      power_ball,
      index,
      base,
      result,
      level + 1
    )
  } else {
    //console.log("upper")
    _getCombinationfromIndex(
      n - 1,
      k,
      power_ball,
      index,
      base + combof_below_no_power_ball,
      result,
      level + 1
    )
  }
}

export function angle (): number {
  const lat1 = 45.45601525767227
  const long1 = -73.54996188669251

  const lat2 = 40.7335166835945
  const long2 = -74.00306387532882

  const dy = lat2 - lat1

  const dx = Math.cos((Math.PI / 180) * lat1) * (long2 - long1)

  const angle = Math.atan2(dy, dx)
  return angle
}

export interface Coordinate {
  lat: number
  long: number
}

export function angle3 (): number {
  const p1: Coordinate = {
    lat: 45.45601525767227,
    long: -73.54996188669251
  }

  const p2: Coordinate = {
    lat: 40.7335166835945,
    long: -74.00306387532882
  }

  return calculate(p1, p2)
}

export function angle3DEG (): number {
  const angRad = angle3()

  return angRad * (180 / Math.PI)
}

export const calculate = (p1: Coordinate, p2: Coordinate): number => {
  const lat1 = toRadians(p1.lat)
  const lat2 = toRadians(p2.lat)
  const delta = toRadians(p2.long - p1.long)

  const cosLat2 = Math.cos(lat2)

  const X = cosLat2 * Math.sin(delta)
  console.log(`X =  Math.cos(${p2.lat}) * sin(${delta})`)
  console.log(`X =  ${X}`)

  const Y =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * cosLat2 * Math.cos(delta)

  console.log(
    `Y = cos(${p1.lat}) * sin(${p2.lat}) – sin(${p1.lat}) * cos(${p2.lat}) * cos(${delta})`
  )
  console.log(`Y =  ${Y}`)

  //X =  Math.cos(39.099912) * sin(4.381010000000003)
  //Y = cos(38.627089) * sin(39.099912) – sin(38.627089) * cos(39.099912) * cos(4.381010000000003)
  const angle = Math.atan2(X, Y)

  return angle
}
/*
initialBearingTo(point) {
    if (!(point instanceof LatLonSpherical)) point = LatLonSpherical.parse(point); // allow literal forms
    if (this.equals(point)) return NaN; // coincident points

    // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
    // see mathforum.org/library/drmath/view/55417.html for derivation

    const φ1 = this.lat.toRadians();
    const φ2 = point.lat.toRadians();
    const Δλ = (point.lon - this.lon).toRadians();

    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const θ = Math.atan2(y, x);

    const bearing = θ.toDegrees();

    return Dms.wrap360(bearing);
}
*/
export const toRadians = (val: number): number => {
  return (val * Math.PI) / 180
}
export const toDegrees = (val: number): number => {
  return (val * 180) / Math.PI
}

export function angle2 (): number {
  const φ1 = 45.45601525767227
  const λ1 = -73.54996188669251

  const φ2 = 40.7335166835945
  const λ2 = -74.00306387532882

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2)
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1)
  const θ = Math.atan2(y, x)
  const brng = ((θ * 180) / Math.PI + 360) % 360 // in degrees
  return brng
}
