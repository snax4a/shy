export class DashboardComponent {
  /*@ngInject*/
  constructor(DashboardService) {
    this.dashboardService = DashboardService;
  }

  $onInit() {
    this.reportsGet();
  }

  async reportsGet() {
    this.top10classes = await this.dashboardService.reportGet('top10classes');
    this.bottom10classes = await this.dashboardService.reportGet('bottom10classes');
    this.top10students = await this.dashboardService.reportGet('top10students');
    this.schoolspie = await this.dashboardService.reportGet('schoolspie');
    this.piedata = this.schoolspie.map(({ count }) => count);
    this.pielabels = this.schoolspie.map(({ location }) => location);
    this.attendancelast90 = await this.dashboardService.reportGet('attendancelast90');

    // [
    //   {
    //     "location": "East Liberty",
    //     "month": "2018-11-01T00:00:00.000Z",
    //     "count": "30"
    //   },
    //   {
    //     "location": "East Liberty",
    //     "month": "2018-12-01T00:00:00.000Z",
    //     "count": "496"
    //   },
    //   {
    //     "location": "North Hills",
    //     "month": "2018-11-01T00:00:00.000Z",
    //     "count": "46"
    //   },
    //   {
    //     "location": "North Hills",
    //     "month": "2018-12-01T00:00:00.000Z",
    //     "count": "436"
    //   }
    // ]

    const groupBy = function(objArray, key) {
      return objArray.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };

    console.log(groupBy(this.attendancelast90, 'location'));

    // const nest = (items, id = null, groupBy = 'location') =>
    //   items
    //     .filter(item => item[groupBy] === id)
    //     .map(item => ({ ...item, children: nest(items, item.id) }));
    // // One top level comment
    // const comments = [
    //   { id: 1, location: null },
    //   { id: 2, location: 1 },
    //   { id: 3, location: 1 },
    //   { id: 4, location: 2 },
    //   { id: 5, location: 4 }
    // ];
    // const nestedComments = nest(comments);
    // console.log(nestedComments);
    const series = Array.from(new Set(this.attendancelast90.map(x => x.location)));
    const labels = Array.from(new Set(this.attendancelast90.map(x => new Date(x.month).toLocaleDateString())));
    let data = [];
    const chartData = {
      series,
      labels,
      data
    };
    console.log(chartData);
      // .map(location => {
      //   return {
      //     series: location,
      //     //labels: new Date(this.attendancelast90.find(d => d.location === location).month),
      //     data: Array.from(this.attendancelast90.find(d => d.location === location).count)
      //   };
      // });
    // this.lineseries = Array.from(new Set(this.attendancelast90.map(x => x.location)));
    // this.linedata = [];
    // for(let location in this.lineseries) {
    //   this.linedata.push(this.attendancelast90.map(x => x.count));
    // }
    //this.linelabels = this.attendancelast90.map(({ month }) => new Date(month));
  }
}
