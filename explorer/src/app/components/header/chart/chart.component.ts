import {Component, OnInit} from "@angular/core";

// const mockedData = {
//   currency: "USD",
//   x: ["21-02-2020", "22-02-2020", "23-02-2020", "24-02-2020", "25-02-2020", "26-02-2020", "27-02-2020", "28-02-2020", "29-02-2020"],
//   y: [0.0007, 0.00071, 0.0007, 0.0006, 0.00041, 0.0004, 0.0004, 0.00034, 0.000378],
// };
declare var DATA: any;

@Component({
  selector: "header-chart",
  templateUrl: "./chart.component.html",
})
export class HeaderChartComponent implements OnInit{
  public data:any;
  public options = {
    series: [{
      // name: mockedData.currency,
      // data: mockedData.y,
      name: "",
      data: [],
    }],
    chart: {
      height: 120,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false,
      },
      offsetY: -12,
    },
    colors: ["#212529"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: [2],
    },
    grid: {
      show: true,
      borderColor: "#eaebf1",
    },
    xaxis: {
      categories: [],
      // categories: mockedData.x,
      labels: {
        show: false,
      },
      tickAmount: 3,
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  ngOnInit(): void {
    let data: any = {}; /// from server node ejs data
    // console.log('window.DATA', (<any>window).DATA)
    if (typeof (<any>window).DATA !== "undefined") {
      data = (<any>window).DATA;
    }
    // console.log('session data');
    // console.log(data);
    this.data = data;
    this.options.series = [{
      name: this.data.chartData.currency,
      data: this.data.chartData.y,
    }];
    this.options.xaxis.categories = this.data.chartData.x;
  }
}
