export class DashboardComponent {
  /*@ngInject*/
  constructor(DashboardService) {
    this.dashboardService = DashboardService;
    this.top10classes = [];
    this.schoolspie = [];
    this.attendancelast90 = [];
    this.top10students = [];
  }

  $onInit() {
    this.reportsGet();
  }

  async reportsGet() {
    this.top10students = await this.dashboardService.reportGet('top10students');
    this.top10classes = await this.dashboardService.reportGet('top10classes');
    this.schoolspie = await this.dashboardService.reportGet('schoolspie');
    this.attendancelast90 = await this.dashboardService.reportGet('attendancelast90');
  }
}
