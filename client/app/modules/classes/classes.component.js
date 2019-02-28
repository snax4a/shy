export class ClassesComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, ClassService, LocationService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.classService = ClassService;
    this.locationService = LocationService;
  }

  $onInit() {
    this.classSchedule = this.classService.classSchedule;
    console.log(this.classSchedule);
    this.classes = this.classService.classes;
    this.locations = this.locationService.locations;
    this.$timeout(this.$anchorScroll, 100);
  }
}
