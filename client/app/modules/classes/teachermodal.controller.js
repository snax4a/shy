export default class TeacherModalController {
  /*@ngInject*/
  constructor($uibModalInstance, firstName, lastName, imageId, bio, url) {
    this.$uibModalInstance = $uibModalInstance;
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio;
    this.imageId = imageId;
    this.url = url;
  }

  cancel() {
    this.$uibModalInstance.close();
  }
}
