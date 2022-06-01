import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { calculateOdds, getCombinationfromIndex, getOddsIndex } from './tools';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {

  //totalNbNumbers: any = 0
  _totalNbNumbers: number = 0
  set totalNbNumbers(val: any) {
    this._totalNbNumbers = Number(val)

    /*
        let a: number[] = [...this.selected].filter(n => n > this.totalNbNumbers)
    
        for (const b of a) {
          this.selected.delete(b)
        }
    */

    for (const b of this.selected) {
      if (b > this.totalNbNumbers) {
        this.selected.delete(b)
      }
    }
  }

  get totalNbNumbers() {
    return this._totalNbNumbers
  }

  drawNbNumber: any = 0
  oddsIndex: any = 0
  combinationOutput: number[] = []

  constructor() { }

  ngOnInit() {
    this.loadData();

    this.combbase_on_index()
  }

  private _odds: number = 0
  combination() {
    this._odds = calculateOdds(this.totalNbNumbers, this.drawNbNumber)
    return this._odds
  }

  combbase_on_index() {

    if (!this.oddsIndex) {
      this.combinationOutput = []
    }

    let comb = getCombinationfromIndex(this.totalNbNumbers, this.drawNbNumber, this.oddsIndex)

    this.combinationOutput = comb

    this.saveData()
  }

  onCombIndexChange($event: any) {
    this.combbase_on_index()
  }

  random() {
    this.oddsIndex = Math.floor(Math.random() * calculateOdds(this.totalNbNumbers, this.drawNbNumber))

    this.combbase_on_index()
  }

  saveData() {

    let obj: SaveData = {

      total: this.totalNbNumbers,
      draw: this.drawNbNumber,
      combIndex: this.oddsIndex,
      selected: [...this.selected]
    }

    let str = JSON.stringify(obj)

    localStorage.setItem('DATA', str)
  }

  private loadData() {
    let data = localStorage.getItem('DATA');
    if (data) {
      let parsed = JSON.parse(data) as SaveData;

      this.oddsIndex = parsed.combIndex;
      this.totalNbNumbers = parsed.total;
      this.drawNbNumber = parsed.draw;
      this.selected = new Set(parsed.selected)
    }
  }


  selected: Set<number> = new Set<number>()
  allNumbers: number[] = []

  getTotalNumbers(): number[] {

    if (this.allNumbers.length != this.totalNbNumbers) {
      this.allNumbers = Array.from([...Array(this.totalNbNumbers).keys()], n => +n + 1)
      let a: number[] = [...this.selected].filter(n => n > this.totalNbNumbers)

      for (const b of a) {
        this.selected.delete(b)
      }
    }
    return this.allNumbers
  }

  clickBall(ball: number) {

    if (!this.selected.delete(ball)) {
      if (this.selected.size < this.drawNbNumber) {
        this.selected.add(ball)
      }
    }
  }

  drawed(ball: number): string {
    return this.selected.has(ball) ? "drawed" : ""
  }


  private _oddsIndex: number = 0

  showOddIndex(): string {
    if (this.selected.size != this.drawNbNumber) {
      return ""
    }
    let s: number[] = [...this.selected].sort((a, b) => a - b);
    this._oddsIndex = getOddsIndex(s, this.totalNbNumbers, this.drawNbNumber)
    //console.log(s, this.totalNbNumbers, this.drawNbNumber)
    this.saveData()
    return this._oddsIndex.toString()
  }

  previous() {
    if (this._oddsIndex <= 1) {
      return
    }

    this._oddsIndex--
    this.selected = new Set(getCombinationfromIndex(this.totalNbNumbers, this.drawNbNumber, this._oddsIndex))
  }

  next() {
    if (this._oddsIndex >= this._odds) {
      return
    }
    this._oddsIndex++
    let comb = getCombinationfromIndex(this.totalNbNumbers, this.drawNbNumber, this._oddsIndex)
    this.selected = new Set(comb)
  }

  private step = 10;

  stepper(): Iterable<number> {
    return new Stepper(this.totalNbNumbers - 1, this.step)
  }

  substepper(start: number): Iterable<number> {
    let limit = Math.min(start + this.step, this.totalNbNumbers)
    return new Stepper(limit, 1, start + 1)
  }
}


interface SaveData {
  total: number,
  draw: number,
  combIndex: number
  selected: number[]
}

class Stepper implements Iterable<number> {

  private _limit
  private _step
  private _start

  constructor(limit: number, step: number = 1, start = 0) {
    this._limit = limit
    this._step = step
    this._start = start
  }

  [Symbol.iterator]() {
    let counter = this._start
    return {
      next: (): IteratorResult<number> => {

        let value = counter
        let done = counter > this._limit
        counter += this._step
        return {
          done: done,
          value: value
        }
      }
    }
  }
}
