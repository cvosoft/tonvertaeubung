import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';
import { setPostSignalSetFn } from '@angular/core/primitives/signals';


@Component({
  selector: 'app-audiograms',
  templateUrl: './audiograms.component.html',
  styleUrls: ['./audiograms.component.scss'],
  standalone: true,
  imports: [FormsModule, BaseChartDirective],
})
export class AudiogramComponent {

  @ViewChild('chartRight', { static: false, read: BaseChartDirective }) chartRight?: BaseChartDirective;
  @ViewChild('chartLeft', { static: false, read: BaseChartDirective }) chartLeft?: BaseChartDirective;

  Math = Math;

  showVertpegel: boolean = false;

  KLRechts = [5, 5, 5, 5, 55, 5];
  LLRechts = [10, 10, 10, 15, 75, 15];

  KLLinks = [15, 15, 15, 20, 20, 5];
  LLLinks = [30, 25, 45, 40, 40, 45];

  VertLinksKL: any = [null, null, null, null, null, null];
  VertLinksLL: any = [null, null, null, null, null, null];
  VertRechtsKL: any = [null, null, null, null, null, null];
  VertRechtsLL: any = [null, null, null, null, null, null];


  constructor() {
    //this.calcVert();
  }


  hideVert() {
    this.VertLinksKL.fill(null);
    this.VertLinksLL.fill(null);
    this.VertRechtsKL.fill(null);
    this.VertRechtsLL.fill(null);
  }

  checkForUberVert(): boolean {
    for (let i = 0; i < this.KLLinks.length; i++) {
      if (this.VertLinksLL[i] - 50 >= this.KLRechts[i]) { return true }
      if (this.VertRechtsLL[i] - 50 >= this.KLLinks[i]) { return true }
      if (this.VertLinksKL[i] - 50 >= this.KLRechts[i]) { return true }
      if (this.VertRechtsKL[i] - 50 >= this.KLLinks[i]) { return true }
    } return false
  }


  checkForVert() {
    this.checkForKLVert();
    this.checkForLLVert();
  }

  calcVert() {
    this.calcKLVert();
    this.calcLLVert();
  }

  checkForKLVert(): boolean {
    // rechts ist besser, links ist schlechter
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = this.KLLinks[i] - this.KLRechts[i];
      if (diff >= 10) {
        // ist es überhaupt nötig?
        let diffMO = this.LLLinks[i] - (this.KLRechts[i] + 10); // auf Messohr
        if (diffMO > 10) {
          return true
        }
      }
    }
    // links ist besser, rechts ist schlechter
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = this.KLRechts[i] - this.KLLinks[i];
      if (diff >= 10) {
        // ist es überhaupt nötig?
        let diffMO = this.LLRechts[i] - (this.KLLinks[i] + 10); // auf Messohr
        if (diffMO > 10) {
          return true
        }
      }
    }
    return false;
  }


  calcKLVert(): any {
    // rechts ist besseres GO, links ist schlechteres MO
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = this.KLLinks[i] - this.KLRechts[i];
      let shadow = this.KLRechts[i] + 10;
      let wandering = this.KLLinks[i] - shadow;
      let SLMO = this.LLLinks[i] - this.KLLinks[i];
      if (diff > 10) { // auf jeden fall nötig
        this.VertRechtsKL[i] = this.LLRechts[i] + 20 + wandering;
      } else if (diff == 10 && SLMO >= 15) { // nur nötig bei dubios. sl anteil
        this.VertRechtsKL[i] = this.LLRechts[i] + 20;
      } else { this.VertRechtsKL[i] = null } // nix los
    }
    // links ist besseres GO, rechts ist schlechteres MO
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = this.KLRechts[i] - this.KLLinks[i];
      let shadow = this.KLLinks[i] + 10;
      let wandering = this.KLRechts[i] - shadow;
      let SLMO = this.LLRechts[i] - this.KLRechts[i];
      if (diff > 10) { // auf jeden fall nötig
        this.VertLinksKL[i] = this.LLLinks[i] + 20 + wandering;
      } else if (diff == 10 && SLMO >= 15) { // nur nötig bei dubios. sl anteil
        this.VertLinksKL[i] = this.LLLinks[i] + 20;
      } else { this.VertLinksKL[i] = null } // nix los
    }
  }


  checkForLLVert(): boolean {
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = Math.abs(this.KLLinks[i] - this.LLRechts[i]);
      if (diff >= 50) {
        return true;
      }
    }
    for (let i = 0; i < this.KLRechts.length; i++) {
      let diff = Math.abs(this.KLRechts[i] - this.LLLinks[i]);
      if (diff >= 50) {
        return true;
      }
    }
    return false;
  }


  calcLLVert() {
    // rechts hat die bessere KL
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = this.LLLinks[i] - this.KLRechts[i];
      if (diff >= 50 && this.KLLinks[i] - this.KLRechts[i] >= 10) {
        this.VertRechtsLL[i] = this.LLRechts[i] + 20 + (diff - 50);
      } else { this.VertRechtsLL[i] = null }
    }
    // links hat die bessere KL
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = this.LLRechts[i] - this.KLLinks[i];
      if (diff >= 50 && this.KLRechts[i] - this.KLLinks[i] >= 10) {
        this.VertLinksLL[i] = this.LLLinks[i] + 20 + (diff - 50);
      } else { this.VertLinksLL[i] = null }
    }
  }

  // Chart-Typ: LineChart
  public lineChartType: ChartType = 'line';


  // Chart-Daten
  public lineChartDataRight: any = {
    labels: ['0.25', '0.5', '1', '2', '4', '8'],
    datasets: [
      {
        data: this.KLRechts,
        borderColor: 'red',
        pointStyle: 'triangle',
        borderDash: [5, 5],
        pointRadius: 7,
        fill: false,
      },
      {
        data: this.LLRechts,
        borderColor: 'red',
        pointRadius: 5,
        fill: false,
      },
      {
        data: this.VertRechtsKL,
        borderColor: 'blue',
        pointStyle: 'star',
        pointRadius: 5,
        fill: false,
        showLine: false //<- set this
      },
      {
        data: this.VertRechtsLL,
        borderColor: 'blue',
        pointStyle: 'rect',
        pointRadius: 5,
        fill: false,
        showLine: false //<- set this
      },
    ]
  };

  // Chart-Daten
  public lineChartDataLeft: any = {
    labels: ['0.25', '0.5', '1', '2', '4', '8'],
    datasets: [
      {
        data: this.KLLinks,
        pointStyle: 'triangle',
        pointRadius: 7,
        borderDash: [5, 5],
        borderColor: 'blue',
        fill: false,
      },
      {
        data: this.LLLinks,
        pointStyle: 'crossRot',
        pointRadius: 10,
        borderColor: 'blue',
        fill: false,
      },
      {
        data: this.VertLinksKL,
        borderColor: 'red',
        pointRadius: 5,
        fill: false,
        pointStyle: 'star',
        showLine: false //<- set this
      },
      {
        data: this.VertLinksLL,
        borderColor: 'red',
        pointStyle: 'rect',
        pointRadius: 5,
        fill: false,
        showLine: false //<- set this
      },
    ]
  };

  // Methode zum Aktualisieren des Charts
  updateCharts() {
    this.lineChartDataRight = { ...this.lineChartDataRight };
    this.lineChartDataLeft = { ...this.lineChartDataLeft };

    // falls keine Pegel - hiden
    if (!this.showVertpegel) { this.hideVert(); }

    this.chartRight?.update(); // Aktualisiert den Chart
    this.chartLeft?.update(); // Aktualisiert den Chart
  }


  toggleVert() {
    if (!this.showVertpegel) {
      this.calcVert();
    } else { this.hideVert() }

    this.showVertpegel = !this.showVertpegel;

    // updaten
    this.updateCharts();
  }


  // Chart-Optionen
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Frequenz (kHz)'
        }
      },
      y: {
        reverse: true,
        beginAtZero: true,
        min: 0,
        max: 120,
        ticks: { stepSize: 10 },
        title: {
          display: true,
          text: 'Hörpegel (dB)',
        }
      }
    }
  };



}