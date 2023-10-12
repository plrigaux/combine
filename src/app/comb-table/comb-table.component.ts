import { Component, Input, OnInit } from '@angular/core'
import { generateCombinationsList, getOddsIndex } from '../tools'

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

  @Input()
  set nb_gold_balls(val: any) {
    this._nb_gold_balls = parseInt(val)
  }


  get nb_gold_balls() : number {
    return this._nb_gold_balls
  }

  private _nbpicks: number = 2
  private _total: number = 4
  private _nb_gold_balls = 2

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
    return val ? 'fill' : ''
  }

  getCombIndex(comb: number[], n: number, k: number): number {
    return getOddsIndex(comb, 1, n, k, 1)
    //return 0
  }
}
