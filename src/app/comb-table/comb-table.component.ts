import { newArray } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-comb-table',
  templateUrl: './comb-table.component.html',
  styleUrls: ['./comb-table.component.scss']
})
export class CombTableComponent implements OnInit {

  @Input()
  set total(val: any) {
    this._total = parseInt(val)
  }

  get total(): number {
    return this._total
  }

  @Input()
  set nbpicks(val: any) {
    this._nbpicks = parseInt(val)
  }

  get nbpicks(): number {
    return this._nbpicks
  }

  private _nbpicks: number = 2
  private _total: number = 4

  combinations: number[][] = []

  constructor() { }

  ngOnInit(): void {
    this.createCombTable()
/*
    getCombIndex([2, 3, 5], this.total, this.nbpicks, 0)
    console.log("dddddddddddddddddddddddddddddddddddd")
    getCombIndex([2, 4], 6, 2)

    console.log("dddddddddddddddddddddddddddddddddddd")
    getCombIndex([1, 4], 6, 2)
    */
    getCombIndex([1, 2,3], 7, 3, 0, 0)
  }

  createCombTable() {


    /*
        for (let combination of combinations2(+this.total, +this.nbpicks)) {
          console.log(combination);
        }
    */
    this.combinations = combinations2(this.total, this.nbpicks)

    //console.log("comb ", this.combinations)

  }

  getRowElem(selected: number[]): string[] {

    let row: string[] = new Array(this.total)

    for (let num of selected) {
      row[num - 1] = num.toString()
    }
    return row
  }

  classFromVal(val: string): string {
    return val ? "fill" : ""
  }

  getCombIndex(comb: number[], n: number, k: number): number {

    return getCombIndex(comb, n, k, 0, 0)
    //return 0
  }
}


function* combinations(n: number, k: number): IterableIterator<number[]> {
  if (k < 1) {
    yield [];
  } else {
    for (let i = k; i <= n; i++) {
      for (let tail of combinations(i - 1, k - 1)) {
        tail.push(i);
        yield tail;
      }
    }
  }
}

function combinations2(n: number, k: number): number[][] {

  let combList: number[][] = []
  //let maxes = getMaxes(n, k)
  //let all = getAllNum(n, k)
  //console.log("maxes", maxes)

  //console.log("all", all)

  let result: number[] = new Array(k)
  console.log("k", k, result)
  combinations2x(n, k, 0, result, combList)

  return combList
}

function combinations2x(n: number, len: number, startPosition: number, result: number[], allResuls: number[][]) {
  if (len == 0) {
    //console.log(result)
    allResuls.push([...result])
    return;
  }

  for (let i = startPosition; i <= n - len;) {
    i++
    result[result.length - len] = i;
    combinations2x(n, len - 1, i, result, allResuls);
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

function getCombIndex(comb: number[], n: number, k: number, prev : number, idx : number): number {

  console.log(`[${comb}] n ${n}, k ${k}, prev ${prev} idx ${idx}`)
  let index = 0

  if (idx >= comb.length) {
    return index
  }

  let ball = comb[idx] - prev
  console.log("ball", ball, `comb[idx] ${comb[idx]} - prev ${prev}`)

  if (k == 1) { 
    index = ball
  } else {
    //console.log(`for (let i = (n - ball + 1) ${n - ball + 1}; i < n ${n}; i++) {`)
    for (let i = (n - ball + 1); i < n; i++) {
      
      let combof_below: number = combinationsNum(i, (k - 1))
      //console.log(`combinationsNum(i "${i}", (k - (j + 1) "${k - 1}")`, `combof_below ${combof_below}`)
      //console.log(`index ${index} combof_below ${combof_below}`)
      index += combof_below
    }
  }
  //console.log(`index b [${comb}]`, index)

  let comb2: number[] = []


  //let sh = ball
  /*
  for (let f = 1; f < comb.length; f++) {
    let shift = comb[f] - ball
    comb2.push(shift)
  }
  */

  let sub_index = getCombIndex(comb, n - ball, k - 1, comb[idx], idx + 1)
  let total_index = index + sub_index

  console.log(`comb [${comb}], total_index ${total_index}, index ${index}, sub_index ${sub_index}`)
  return total_index
}


function calculateBefore(n: number, k: number) {
  /*  let ball = comb[0]
  
  3 2
  4 2
  5 2
  6 2
  
    for( let i  = (n - ball + 1); i < n; i++) {
      let combof_below: number = combinationsNum(i, 2)
      index += combof_below
    }
  
    return index
    */
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

function combinationsNum(n: number, r: number): number {
  let num = factorialFrom(n, n - r + 1)
  let den = factorial(r)

  let val = num / den

  return val
}

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