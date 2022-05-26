import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comb-table',
  templateUrl: './comb-table.component.html',
  styleUrls: ['./comb-table.component.scss']
})
export class CombTableComponent implements OnInit {

  totalBalls = 4
  balls = 2

  constructor() { }

  ngOnInit(): void {
    this.createCombTable()
  }

  createCombTable() {

    let blabla = []

    for (let i = 0; i < this.totalBalls; i++) {

      let row = new Array(this.totalBalls)

      blabla.push(row)
    }

    for (let combination of combinations2(this.totalBalls, this.balls)) { 
      console.log(combination);
    }
  }


}


function* combinations(n :number, k : number) : IterableIterator<number[]> { 
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

function
 combinations2(n :number, k : number) : IterableIterator<number[]> { 
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
