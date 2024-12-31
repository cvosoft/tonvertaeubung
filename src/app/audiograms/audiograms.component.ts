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

  @ViewChild('chartRight', { static: false }) chartRight?: BaseChartDirective;
  @ViewChild('chartLeft', { static: false }) chartLeft?: BaseChartDirective;

  KLRechts = [20, 20, 25, 25, 20, 25];
  LLRechts = [30, 40, 45, 55, 50, 55];

  KLLinks = [10, 10, 5, 5, 0, 5];
  LLLinks = [20, 20, 15, 15, 10, 15];

  // Chart-Typ: LineChart
  public lineChartType: ChartType = 'line';


  // Chart-Daten
  public lineChartDataRight = {
    labels: ['0.25', '0.5', '1', '2', '4', '8'],
    datasets: [
      {
        data: this.KLRechts,
        borderColor: 'red',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        data: this.LLRechts,
        borderColor: 'red',
        pointRadius: 5,
        fill: false,
      },
    ]
  };

  // Chart-Daten
  public lineChartDataLeft = {
    labels: ['0.25', '0.5', '1', '2', '4', '8'],
    datasets: [
      {
        data: this.KLLinks,
        pointStyle: 'crossRot',
        pointRadius: 0,
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
      }
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

  checkBone(): boolean {
    this.lineChartDataRight.datasets[0].data.forEach((element, i) => {
      let diff = element - this.lineChartDataLeft.datasets[0].data[i];
      console.log(diff);
    })
    return false
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