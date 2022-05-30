import { newArray } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { generateCombinationsList, getCombinationIndex } from '../tools';

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

  }

  createCombTable() {


    /*
        for (let combination of combinations2(+this.total, +this.nbpicks)) {
          console.log(combination);
        }
    */
    this.combinations = generateCombinationsList(this.total, this.nbpicks)

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

    return getCombinationIndex(comb, n, k, 0, 0)
    //return 0
  }
}