import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { calculateOdds, getCombinationfromIndex, getOddsIndex } from './tools';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {

  totalNbNumbers: any = 0
  drawNbNumber: any = 0
  oddsIndex: any = 0
  combinationOutput: number[] = []

  constructor() { }

  ngOnInit() {
    this.loadData();

    this.combbase_on_index()
  }

  combination() {
    return calculateOdds(this.totalNbNumbers, this.drawNbNumber)
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


  selected = new Set<number>()
  allNumbers: number[] = []

  getTotalNumbers(): number[] {

    if (this.allNumbers.length != this.totalNbNumbers) {
      this.allNumbers = Array.from([...Array(this.totalNbNumbers).keys()], n => n + 1)
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

  showOddIndex(): string {
    if (this.selected.size != this.drawNbNumber) {
      return ""
    }
    let s: number[] = [...this.selected].sort();
    let val = getOddsIndex(s, this.totalNbNumbers, this.drawNbNumber)
    //console.log(s, this.totalNbNumbers, this.drawNbNumber)
    this.saveData()
    return val.toString()
  }
}

interface SaveData {
  total: number,
  draw: number,
  combIndex: number
  selected: number[]
}