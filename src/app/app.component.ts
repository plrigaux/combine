import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { combinationsNum, getCombinationfromIndex } from './tools';

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
    getCombinationfromIndex(50, 7,  combinationsNum(50, 7)/2)
  }

  comb(n: number, r: number) {
    return combinationsNum(n, r)
  }


}
