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
  toDegrees
} from './tools'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  set_mega_millions () {
    this.totalNbNumbers = 70
    this.drawNbNumber = 5
    this.power_ball = 25
  }
  set_lotto_max () {
    this.totalNbNumbers = 50
    this.drawNbNumber = 7
    this.power_ball = 1
  }
  //totalNbNumbers: any = 0
  _totalNbNumbers: number = 0
  _power_ball: number = 1

  set totalNbNumbers (val: any) {
    this._totalNbNumbers = Number(val)

    for (const selectedNumber of this._selected) {
      if (selectedNumber > this.totalNbNumbers) {
        this._selected.delete(selectedNumber)
      }
    }
  }

  get totalNbNumbers () {
    return this._totalNbNumbers
  }

  set power_ball (val: any) {
    this._power_ball = Number(val)
  }

  get power_ball () {
    return this._power_ball
  }

  drawNbNumber: any = 0
  oddsIndex: any = 0
  combinationOutput: number[] = []

  constructor (@Inject(LOCALE_ID) public locale: string) {}

  ngOnInit () {
    this.loadData()

    this.combbase_on_index()
  }

  private _odds: number = 0
  combination () {
    this._odds = calculateOdds(
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball
    )
    return formatNumber(this._odds, this.locale)
  }

  combbase_on_index () {
    if (!this.oddsIndex) {
      this.combinationOutput = []
    }

    let results = getCombinationfromIndex(
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball,
      this.oddsIndex
    )

    this.combinationOutput = results.main_pool

    this.saveData()
  }

  onCombIndexChange ($event: any) {
    this.combbase_on_index()
  }

  random () {
    this.oddsIndex = Math.floor(
      Math.random() *
        calculateOdds(this.totalNbNumbers, this.drawNbNumber, this.power_ball)
    )

    this.combbase_on_index()
  }

  saveData () {
    let obj: SaveData = {
      total: this.totalNbNumbers,
      draw: this.drawNbNumber,
      combIndex: this.oddsIndex,
      selected: [...this._selected]
    }

    let str = JSON.stringify(obj)

    localStorage.setItem('DATA', str)
  }

  private loadData () {
    let data = localStorage.getItem('DATA')
    if (data) {
      let parsed = JSON.parse(data) as SaveData

      this.oddsIndex = parsed.combIndex
      this.totalNbNumbers = parsed.total
      this.drawNbNumber = parsed.draw
      this._selected = new Set(parsed.selected)
    }
  }

  private _selected: Set<number> = new Set<number>()
  private _allGeneratedNumbers: number[] = []

  getTotalNumbers (): number[] {
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

  clickBall (ball: number) {
    if (!this._selected.delete(ball)) {
      if (this._selected.size < this.drawNbNumber) {
        this._selected.add(ball)
      }
    }
  }

  drawed (ball: number): string {
    return this._selected.has(ball) ? 'drawed' : ''
  }

  private _oddsIndex: number = 0

  private _isAllNumberdrawed (): boolean {
    return this._selected.size == this.drawNbNumber
  }

  showOddIndex (): string {
    if (!this._isAllNumberdrawed()) {
      return ''
    }

    let selectedSortedArray: number[] = [...this._selected].sort(
      (a, b) => a - b
    )
    this._oddsIndex = getOddsIndex(
      selectedSortedArray,
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball
    )
    //console.log(s, this.totalNbNumbers, this.drawNbNumber)
    this.saveData()

    return formatNumber(this._oddsIndex, this.locale)
  }

  previousDisable (): boolean {
    return !(this._isAllNumberdrawed() && this._oddsIndex > 1)
  }

  nextDisable (): boolean {
    return !(this._isAllNumberdrawed() && this._oddsIndex < this._odds)
  }

  previous () {
    if (this._oddsIndex <= 1) {
      return
    }

    this._oddsIndex--
    let results = getCombinationfromIndex(
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball,
      this._oddsIndex
    )
    this._selected = new Set(results.main_pool)
  }

  next () {
    if (this._oddsIndex >= this._odds) {
      return
    }
    this._oddsIndex++
    let results = getCombinationfromIndex(
      this.totalNbNumbers,
      this.drawNbNumber,
      this.power_ball,
      this._oddsIndex
    )

    this._selected = new Set(results.main_pool)
  }

  private step = 10

  stepper (): Iterable<number> {
    //return new Stepper(this.totalNbNumbers - 1, this.step)
    return setRange(0, this.totalNbNumbers - 1, this.step)
  }

  stepper_power_ball (): Iterable<number> {
    //return new Stepper(this.totalNbNumbers - 1, this.step)
    return setRange(0, this.power_ball - 1, this.step)
  }

  substepper (start: number): Iterable<number> {
    let limit = Math.min(start + this.step, this.totalNbNumbers)
    //return new Stepper(limit, 1, start + 1)
    return setRange(start + 1, limit, 1)
  }

  angleShow (): number {
    return angle()
  }

  angleShow2 (): number {
    return angle2()
  }

  angleShow3 (): number {
    return angle3DEG()
  }

  angleShowRAD (): number {
    return angle3()
  }

  angleShowEx (): number {
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

  angleShowExMy (): number {
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

  angleShowExMy3 (): number[] {
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

  angleShowExMyTheThisn (): number[] {
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

  myIndex (): number[] {
    const odds = calculateOdds(50, 7, 1)

    const vv = this.angleShowExMyTheThisn().map(v => {
      return Math.round(v * odds)
    })

    return vv
  }
}

interface SaveData {
  total: number
  draw: number
  combIndex: number
  selected: number[]
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
