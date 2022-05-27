import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver) { }

  ngAfterViewInit() {
    /*
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    */
    /*
     this.getN(7, 3, 6)
     this.getN(7, 3, 7)
     this.getN(7, 3, 8)
     this.getN(7, 3, 9)
     this.getN(7, 3, 10)
     */
/*
    for (let i = 1; i <= 35; i++) {
      this.getN(7, 3, i)
    }

    */

    //this.getN(50, 7, 1000000)
    this.getN(50, 7,  combinations(50, 7)/2)
  }

  comb(n: number, r: number) {
    return combinations2(n, r)
  }

  getN(n: number, r: number, id: number) {
    let c = combinations(n, r)

    if (id > c) {
      console.log("out", c, id)
      return
    }

    console.log("combinations", c, id)
    let result: number[] = []
    this.getN2(n, r, id, 0, result, 1)

    console.log("res idx", id, result)
  }

  getN2(n: number, r: number, id: number, base: number, result: number[], level: number) {

    if (r == 1) {
      //console.warn("n", n - 1, r - 1, base, id)
      result.push(id - base + level - 1)
      return
    }

    let combof_below: number = combinations(n - 1, r - 1)
    //console.log("base", base, "c", combof_below, "id", id, "n", n, "r", r, "lvl", level, result)

    if (id <= combof_below + base) {
      result.push(level)
      //console.log("lower")
      this.getN2(n - 1, r - 1, id, base, result, level + 1)
    } else {
      //console.log("upper")
      this.getN2(n - 1, r, id, base + combof_below, result, level + 1)
    }
  }
}

function combinations(n: number, r: number): number {
  let num = factorial(n)
  let den = factorial(r) * factorial(n - r)

  let val = num / den
  //console.log(num , den, "  ", val)
  return val

}

function combinations2(n: number, r: number): number {
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