import { formatNumber } from '@angular/common'
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import {
  angle,
  angle2,
  angle3,
  angle3DEG,
  calculate,
  calculateOdds,
  Coordinate,
  getCombinationfromIndex,
  getOddsIndex,
  Result,
  toDegrees
} from './tools'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  set_mega_millions() {
    this.totalNbNumbers = 70
    this.drawNbNumber = 5
    this.power_ball_pool_size = 25
  }

  set_power_ball() {
    this.totalNbNumbers = 69
    this.drawNbNumber = 5
    this.power_ball_pool_size = 26
  }

  set_lotto_max() {
    this.totalNbNumbers = 50
    this.drawNbNumber = 7
    this.power_ball_pool_size = 1
  }

  //totalNbNumbers: any = 0
  _totalNbNumbers: number = 0
  _power_ball: number = 1

  set totalNbNumbers(val: any) {
    this._totalNbNumbers = Number(val)

    for (const selectedNumber of this._selected) {
      if (selectedNumber > this.totalNbNumbers) {
        this._selected.delete(selectedNumber)
      }
    }
  }

  get totalNbNumbers() {
    return this._totalNbNumbers
  }

  set power_ball_pool_size(val: any) {
    this._power_ball = Number(val)
  }

  get power_ball_pool_size() {
    return this._power_ball
  }

  link: boolean = false
  drawNbNumber: any = 0
  oddsIndex: any = 0
  nomalized_index: number = 0
  combinationOutput: Result = new Result(1, 1, 1)

  constructor(@Inject(LOCALE_ID) public locale: string) { }

  ngOnInit() {
    this.loadData()

    this.combbase_on_index(1)
  }

  private _odds: number = 0

  getOdds(): number {
    if (!this._odds) {
      this._odds = calculateOdds(
        this.totalNbNumbers,
        this.drawNbNumber,
        this.power_ball_pool_size
      )
    }

    return this._odds
  }

  combination() {
    this._odds = calculateOdds(
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball_pool_size
    )
    return formatNumber(this._odds, this.locale)
  }

  combbase_on_index(oddsIndex: number) {

    if (!oddsIndex || oddsIndex <= 1) {
      //this.combinationOutput = new Result(1, 1, 1)
      oddsIndex = 1
    }

    this.oddsIndex = oddsIndex
    this.nomalized_index = this.oddsIndex % this.getOdds()

    if (this.nomalized_index === 0) {
      this.nomalized_index = this.getOdds()
    }

    let results = getCombinationfromIndex(
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball_pool_size,
      this.nomalized_index
    )

    this.combinationOutput = results

    if (this.link) {
      this._oddsIndex = this.oddsIndex
    }

    this.saveData()
  }

  onCombIndexChange($event: any) {
    this.combbase_on_index(this.oddsIndex)
  }

  random() {
    const oddsIndex = Math.floor(
      Math.random() *
      calculateOdds(
        this.totalNbNumbers,
        this.drawNbNumber,
        this.power_ball_pool_size
      )
    )

    this.combbase_on_index(oddsIndex)
  }

  saveData() {
    let obj: SaveData = {
      total: this.totalNbNumbers,
      draw: this.drawNbNumber,
      combIndex: this.oddsIndex,
      selected: [...this._selected],
      selected_gold_ball: this.get_selected_gold_ball(),
      norm_comb_index: this.nomalized_index,
      gold_ball_pool_size: this.power_ball_pool_size
    }

    let str = JSON.stringify(obj)

    localStorage.setItem('DATA', str)
  }

  private loadData() {
    let data = localStorage.getItem('DATA')
    if (data) {
      let parsed = JSON.parse(data) as SaveData

      this.oddsIndex = parsed.combIndex
      this.totalNbNumbers = parsed.total
      this.drawNbNumber = parsed.draw
      this._selected = new Set(parsed.selected)
      this.set_gold_ball(parsed.selected_gold_ball)
      this.nomalized_index = parsed.norm_comb_index
      this.power_ball_pool_size = parsed.gold_ball_pool_size
    }
  }

  private _selected: Set<number> = new Set<number>()
  private _inblink: Set<number> = new Set<number>()
  private _selected_power_ball: Set<number> = new Set<number>()
  private _allGeneratedNumbers: number[] = []

  getTotalNumbers(): number[] {
    if (this._allGeneratedNumbers.length != this.totalNbNumbers) {
      this._allGeneratedNumbers = Array.from(
        { length: this.totalNbNumbers },
        (_, i) => i + 1
      )

      this._selected = new Set(
        [...this._selected].filter(x => x > this.totalNbNumbers)
      )
    }
    return this._allGeneratedNumbers
  }

  clickBall(ball: number) {
    if (!this._selected.delete(ball)) {
      if (this._selected.size < this.drawNbNumber) {
        this._selected.add(ball)
      } else {
        this._inblink.add(ball)
        setTimeout(() => {
          this._inblink.delete(ball)
        }, 3000)
      }
    }

    this.updateSelectorIndex()
  }

  clickBall_power_ball(ball: number) {
    this.set_gold_ball(ball)

    this.updateSelectorIndex()
  }

  set_gold_ball(ball: number) {
    this._selected_power_ball.clear()
    this._selected_power_ball.add(ball)
  }

  drawed(ball: number): string {
    return this._selected.has(ball)
      ? 'drawed'
      : this._inblink.has(ball)
        ? 'blink'
        : ''
  }

  drawed_power_ball(ball: number): string {
    return this._selected_power_ball.has(ball) ? 'drawed_power_ball' : ''
  }

  private _oddsIndex: number = 0

  private _isAllNumberdrawed(): boolean {
    return this._selected.size == this.drawNbNumber && this._selected_power_ball.size == 1
  }

  updateSelectorIndex() {
    if (!this._isAllNumberdrawed()) {
      return
    }

    let selectedSortedArray: number[] = [...this._selected].sort(
      (a, b) => a - b
    )

    const gold_ball = this.get_selected_gold_ball()
    console.log("gold_ball", gold_ball)
    this._oddsIndex = getOddsIndex(
      selectedSortedArray,
      gold_ball,
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball_pool_size
    )

    this.saveData()
  }

  showOddIndex(): string {
    if (!this._isAllNumberdrawed()) {
      return ''
    }

    return formatNumber(this._oddsIndex, this.locale)
  }

  get_selected_gold_ball(): number {
    return [...this._selected_power_ball][0] || 1
  }

  previousDisable(): boolean {
    return !(this._isAllNumberdrawed() && this._oddsIndex > 1)
  }

  nextDisable(): boolean {
    return !(this._isAllNumberdrawed() && this._oddsIndex < this._odds)
  }

  previous() {
    if (this._oddsIndex <= 1) {
      return
    }

    this._oddsIndex--

    this._update_selection()
  }

  next() {
    if (this._oddsIndex >= this.getOdds()) {
      return
    }

    this._oddsIndex++

    this._update_selection()
  }

  private _update_selection() {
    let results = getCombinationfromIndex(
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball_pool_size,
      this._oddsIndex
    )

    console.log("before", this._selected, this._selected_power_ball)
    this._selected = new Set(results.main_pool)
    this.set_gold_ball(results.power_ball)
    console.log("after", this._selected, this._selected_power_ball)
  }

  private step = 10

  stepper(): Iterable<number> {
    //return new Stepper(this.totalNbNumbers - 1, this.step)
    return setRange(0, this.totalNbNumbers - 1, this.step)
  }


  stepper_power_ball(): Iterable<number> {
    //return new Stepper(this.totalNbNumbers - 1, this.step)
    return setRange(0, this.power_ball_pool_size - 1, this.step)
  }

  substepper(start: number): Iterable<number> {
    let limit = Math.min(start + this.step, this.totalNbNumbers)
    //return new Stepper(limit, 1, start + 1)
    return setRange(start + 1, limit, 1)
  }

  substepper_power_ball(start: number): Iterable<number> {
    let limit = Math.min(start + this.step, this.power_ball_pool_size)
    //return new Stepper(limit, 1, start + 1)
    return setRange(start + 1, limit, 1)
  }

  /*
    angleShow(): number {
      return angle()
    }
  
    angleShow2(): number {
      return angle2()
    }
  
    angleShow3(): number {
      return angle3DEG()
    }
  
    angleShowRAD(): number {
      return angle3()
    }
  
    angleShowEx(): number {
      const p1: Coordinate = {
        lat: 39.099912,
        long: -94.581213
      }
  
      const p2: Coordinate = {
        lat: 38.627089,
        long: -90.200203
      }
  
      const angle = calculate(p1, p2)
      return toDegrees(angle)
    }
  
    angleShowExMy(): number {
      const p1: Coordinate = {
        lat: 45.45601525767227,
        long: -73.54996188669251
      }
  
      const p2: Coordinate = {
        lat: 40.7335166835945,
        long: -74.00306387532882
      }
  
      const angle = calculate(p1, p2)
      return toDegrees(angle)
    }
  
    angleShowExMy3(): number[] {
      const p1: Coordinate = {
        lat: 45.45601525767227,
        long: -73.54996188669251
      }
  
      const p2: Coordinate = {
        lat: 40.7335166835945,
        long: -74.00306387532882
      }
  
      const angle = calculate(p1, p2)
      const val1 = -toDegrees(angle)
      const val2 = toDegrees(angle)
      //return - toDegrees(angle) + 90
      return [val1, -toDegrees(angle + Math.PI / 4), val2]
    }
  
    angleShowExMyTheThisn(): number[] {
      const p1: Coordinate = {
        lat: 45.45601525767227,
        long: -73.54996188669251
      }
  
      const p2: Coordinate = {
        lat: 40.7335166835945,
        long: -74.00306387532882
      }
  
      const angle = calculate(p1, p2)
      //return (- angle + Math.PI / 2) / (2 * Math.PI)
      //return ((- angle / (2 * Math.PI)) + 0.25)
      const val1 = -toDegrees(angle)
      const val12 = -toDegrees(angle + Math.PI / 4)
      const val2 = toDegrees(angle)
  
      //return [val1, -toDegrees(angle + Math.PI / 4), val2]
  
      const v1 = -angle / (2 * Math.PI)
      const v2 = -angle / (2 * Math.PI) + 0.25
      const v3 = 2 * Math.PI + angle / (2 * Math.PI)
      return [v1, v2, v3]
    }
  
    myIndex(): number[] {
      const odds = calculateOdds(50, 7, 1)
  
      const vv = this.angleShowExMyTheThisn().map(v => {
        return Math.round(v * odds)
      })
  
      return vv
    }*/
}

interface SaveData {
  total: number
  draw: number
  combIndex: number
  selected: number[]
  selected_gold_ball: number
  norm_comb_index: number
  gold_ball_pool_size: number
}

const setRange = (start: number, stop: number, step: number): number[] => {
  if (stop == 0) {
    return []
  }

  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  )
}
