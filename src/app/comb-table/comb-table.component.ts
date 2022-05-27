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
  total :string = "4"

  @Input()
  nbpicks : string = "2"

  combinations: number[][] = []

  constructor() { }

  ngOnInit(): void {
    this.createCombTable()
  }

  createCombTable() {

    let blabla = []

/*
    for (let combination of combinations2(+this.total, +this.nbpicks)) {
      console.log(combination);
    }
*/
    this.combinations = combinations2(+this.total, +this.nbpicks)

    //console.log(this.combinations)

  }

  getRowElem(selected: number[]): string[] {

    let row: string[] = new Array(+this.total)

    for (let num of selected) {
      row[num - 1] = num.toString()
    }
    return row
  }

  classFromVal(val: string): string {
    return val ? "fill" : ""
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
  let all = getAllNum(n, k)
  //console.log("maxes", maxes)

  //console.log("all", all)

  combinations2x(n, k, 0, new Array(k), combList)

  return combList
}

function combinations2x(all: number, len: number, startPosition: number, result: number[], allResuls: number[][]) {
  if (len == 0) {
    //console.log(result)
    allResuls.push([...result])
    return;
  }

  for (let i = startPosition; i <= all - len;) {
    i++
    result[result.length - len] = i;
    combinations2x(all, len - 1, i, result, allResuls);
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
