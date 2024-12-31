import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';


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

  show: boolean = false;

  KLRechts = [10, 10, 5, 5, 0, 5];
  LLRechts = [30, 40, 45, 55, 50, 55];

  KLLinks = [10, 10, 5, 5, 0, 5];
  LLLinks = [20, 20, 15, 15, 10, 15];

  VertLinksKL = [60, null, null, null, null, null];
  VertLinksLL = [70, null, null, null, null, null];
  VertRechtsKL = [80, null, null, null, null, null];
  VertRechtsLL = [90, null, null, null, null, null];


  checkKLVert(): boolean {
    for (let i = 0; i < this.KLLinks.length; i++) {
      // rechts ist besser, links ist schlechter
      let diff = this.KLLinks[i] - this.KLRechts[i];
      if (diff >= 10) {
        // ist es überhaupt nötig?
        let diffMO = this.LLLinks[i] - this.KLLinks[i]; // auf Messohr
        if (diffMO > 10) { return true }
      }
    }
    for (let i = 0; i < this.KLLinks.length; i++) {
      // links ist besser, rechts ist schlechter
      let diff = this.KLRechts[i] - this.KLLinks[i];
      if (diff >= 10) {
        // ist es überhaupt nötig?
        let diffMO = this.LLRechts[i] - this.KLRechts[i]; // auf Messohr
        if (diffMO > 10) { return true }
      }
    }

    return false;
  }

  checkLLVert(): boolean {
    for (let i = 0; i < this.KLLinks.length; i++) {
      let diff = Math.abs(this.KLLinks[i] - this.LLRechts[i]);
      if (diff >= 50) { return true }
    }
    for (let i = 0; i < this.KLRechts.length; i++) {
      let diff = Math.abs(this.KLRechts[i] - this.LLLinks[i]);
      if (diff >= 50) { return true }
    }
    return false;
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
        pointRadius: 5,
        fill: false,
      },
      {
        data: this.VertRechtsLL,
        borderColor: 'blue',
        pointRadius: 5,
        fill: false,
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
      },
      {
        data: this.VertLinksLL,
        borderColor: 'red',
        pointRadius: 5,
        fill: false,
      },
    ]
  };

  // Methode zum Aktualisieren des Charts
  updateChartRight() {
    this.lineChartDataRight = { ...this.lineChartDataRight };
    this.chartRight?.update(); // Aktualisiert den Chart
  }
  updateChartLeft() {
    this.lineChartDataLeft = { ...this.lineChartDataLeft };
    this.chartLeft?.update(); // Aktualisiert den Chart
  }


  toggleVert() {
    if (!this.show) {
      this.VertLinksKL.fill(null);
      this.VertLinksLL.fill(null);
      this.VertRechtsKL.fill(null);
      this.VertRechtsLL.fill(null);
    }
    this.updateChartLeft();
    this.updateChartRight();

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
        title: {
          display: true,
          text: 'Hörpegel (dB)',
        }
      }
    }
  };



}