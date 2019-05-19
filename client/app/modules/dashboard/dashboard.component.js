export class DashboardComponent {
  /*@ngInject*/
  constructor($timeout, DashboardService) {
    this.$timeout = $timeout;
    this.dashboardService = DashboardService;
    this.chart = {};
    this.chart2 = {};
  }

  $onInit() {
    return Promise.all([ // get data in parallel
      this.teacherpay(),
      this.attendeesnhpq(),
      this.top10classes(),
      this.bottom10classes(),
      this.attendancelast18m(),
      this.studentsWhoOwe(),
      this.schoolspie(),
      this.revenuelast18m()
    ]);
  }

  top10classes() {
    return this.dashboardService.reportGet('top10classes')
      .then(data => {
        this.top10classes = data;
      });
  }

  bottom10classes() {
    return this.dashboardService.reportGet('bottom10classes')
      .then(data => {
        this.bottom10classes = data;
      });
  }

  top10students() {
    return this.dashboardService.reportGet('top10students')
      .then(data => {
        this.top10students = data;
      });
  }

  studentsWhoOwe() {
    return this.dashboardService.reportGet('studentsWhoOwe')
      .then(data => {
        this.studentsWhoOwe = data;
      });
  }

  schoolspie() {
    return this.dashboardService.reportGet('schoolspie')
      .then(data => {
        this.piedata = data.map(({ count }) => count);
        this.pielabels = data.map(({ location }) => location);
      });
  }

  revenuelast18m() {
    const lineColor = '#00FF00';
    const alpha = 0.25;
    const backgroundColor = Color(lineColor)
      .alpha(alpha)
      .rgbString();

    return this.dashboardService.reportGet('revenuelast18m')
      .then(rawdata => {
        this.chart2 = {
          datasetOverride: {
            label: 'Revenue',
            pointBorderColor: '#fff',
            pointBackgroundColor: lineColor,
            borderColor: lineColor,
            backgroundColor
          },
          labels: Array.from(new Set(rawdata.map(x => x.month.substring(0, 7)))),
          data: rawdata.map(x => parseInt(x.revenue, 10)),
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  callback: value => `$${value.toLocaleString()}`
                }
              }]
            },
            tooltips: {
              callbacks: {
                label: tooltipItem => `$${tooltipItem.yLabel.toLocaleString()}`
              }
            }
          }
        };
      });
  }

  attendancelast18m() {
    return this.dashboardService.reportGet('attendancelast18m')
      .then(rawdata => {
        const series = Array.from(new Set(rawdata.map(x => x.location)));
        const labels = Array.from(new Set(rawdata.map(x => x.month.substring(0, 7))));
        let data = [];
        for(let location in series) {
          const locationData = rawdata.filter(x => x.location === series[location]);
          data.push(locationData.map(x => parseInt(x.count, 10)));
        }
        this.chart = {
          series,
          labels,
          data,
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  callback: value => value.toLocaleString()
                },
                stacked: true
              }]
            }
          }
        };
      });
  }

  teacherpay() {
    return this.dashboardService.reportGet('teacherpay')
      .then(data => {
        this.teacherpay = data;
      });
  }

  attendeesnhpq() {
    return this.dashboardService.reportGet('attendeesnhpq')
      .then(data => {
        this.attendeesnhpq = data;
      });
  }

  csvGet() {
    return this.dashboardService.csvGet()
      .then(() => true); // done
  }
}
