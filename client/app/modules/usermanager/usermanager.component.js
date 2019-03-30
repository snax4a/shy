import { ClassAdderController } from './classadder.controller';
import { UserEditorController } from './usereditor.controller';
import { HistoryEditorController } from './historyeditor.controller';

export class UserManagerComponent {
  /*@ngInject*/
  constructor($uibModal, paginationService, User, HistoryService) {
    this.$uibModal = $uibModal;
    this.paginationService = paginationService; // dirPagination
    this.User = User; // used by search() and createUser()
    this.historyService = HistoryService;
  }

  // Initializations
  $onInit() {
    this.alerts = [];
    this.users = [];
    this.historyItems = [];
    this.reverse = false;
    this.sortKey = 'lastName';
    this.submitted = false;
  }

  // Binding was changed by parent
  $onChanges(changes) {
    // Skip if first firing of $onChanges or users array is empty
    if(!changes.user.currentValue || this.users.length == 0) return;
    // Get userId that was changed (ignoring ts property)
    const userId = changes.user.currentValue._id;
    // Find that userId in displayed users (if they are)
    const index = this.users.findIndex(element => element._id === userId);
    // Alter displayed user's balance
    if(index !== -1) this.users[index].balance = this.users[index].balance - changes.user.currentValue.balanceChange;
    this.historyHide(); // Hide the history since it's no longer valid
  }

  // close the alert by deleting the element in the array
  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

  // Get an array of users whose email, first or last name starts with the filter
  search(form) {
    this.submitted = true;
    if(form.$valid) {
      this.User.query({ filter: this.filterField})
        .$promise
        .then(users => {
          this.paginationService.setCurrentPage('users', 1);
          this.users = users;
          this.historyItems = [];
        });
    }
  }

  // Delete the user from the server and in the local array
  delete(selectedUser) {
    selectedUser
      .$remove({ id: selectedUser._id }) // Try to delete the user from the server
      .then(() => this.users.splice(this.users.indexOf(selectedUser), 1)) // Remove them from the array)
      .catch(() => this.alerts.push({ type: 'alert-danger', message: 'This user cannot be deleted because they have a history. Please delete their attendances and purchases first.'}));
  }

  // Open modal to add classes
  modalClassAdder(user) {
    let modalDialog = this.$uibModal.open({
      template: require('./classadder.pug'),
      backdrop: false, // else mouseup outside of box dismisses dialog
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ClassAdderController,
      resolve: {
        userGettingClasses: () => user
      }
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      // if we add any classes, update the count in the grid
    });
  }

  // Open a dialog for editing the selected history item
  modalHistoryEditor(historyItem) {
    const originalQuantity = historyItem.quantity;
    let modalDialog = this.$uibModal.open({
      template: require('./historyeditor.pug'),
      backdrop: false, // else mouseup outside of box dismisses dialog
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: HistoryEditorController,
      resolve: {
        historyItemToEdit: () => historyItem
      }
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      // If we added a history record, update the count in the grid
      this.user.balance += historyItem.quantity - originalQuantity;
    });
  }

  // Open a dialog for editing the user
  modalUserEditor(user) {
    let modalDialog = this.$uibModal.open({
      template: require('./usereditor.pug'),
      backdrop: false, // else mouseup outside of box dismisses dialog
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: UserEditorController,
      resolve: {
        userSelectedForEditing: () => user
      }
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(user.shouldBeDeleted) this.users.splice(this.users.indexOf(user), 1); // Remove them from the array
    });
  }

  // Create a user with the appropriate defaults (enforce role setting server-side)
  createUser() {
    let user = new this.User({
      _id: 0,
      provider: 'local',
      role: 'student',
      balance: 0,
      optOut: false
    });

    this.users.unshift(user);
    this.modalUserEditor(user);
  }

  // Wrap modalUserEditor in case we need to do anything outside of it
  editUser(user) {
    this.modalUserEditor(user);
  }

  // Manage which column determines the sort and the ASC/DESC
  sortUsers(keyname) {
    this.sortKey = keyname;
    this.reverse = !this.reverse;
  }

  attendanceAdd(user) {
    const { attended, locationId, classId, teacherId } = this.parent;

    // Check to see if required fields have been selected
    if(!(attended && classId && locationId && teacherId)) {
      this.alerts.push({
        type: 'alert-warning',
        message: 'Please make sure the class, date, studio, and teacher are selected first.'
      });
      return;
    }

    // Check to see if student is already in this.parent.attendees array
    const found = this.parent.attendees.findIndex(element => element.userId === user._id) !== -1;
    if(found) {
      this.alerts.push({
        type: 'alert-warning',
        message: 'That student was already added'
      });
      return;
    }

    const historyItem = {
      type: 'A',
      userId: user._id,
      attended,
      locationId,
      classId,
      teacherId
    };

    this.historyService.historyItemAdd(historyItem)
      .then(() => {
        // lower the balance by one
        user.balance--;

        // display an alert if balance = 0
        if(user.balance === 0) {
          this.alerts.push({
            type: 'alert-warning',
            message: 'This student needs to purchase more classes before coming next time.'
          });
        }

        // display an alert if balance < 0
        if(user.balance < 0) {
          this.alerts.push({
            type: 'alert-danger',
            message: 'This student already has a negative balance; they need to buy at least two cards before coming next time.'
          });
        }

        // Hide history (forcing the user to re-request if they want it)
        this.historyHide();

        // Refresh list
        this.parent.attendeeLookup();

        return true;
      }) // success
      .catch(response => console.error('Error', response));
  }

  // Wrapper for modalClassAdder
  classAdd(user) {
    this.historyHide();
    this.modalClassAdder(user);
  }

  // Get an array of purchases & attendances with a running balance
  historyGet(selectedUser) {
    this.user = selectedUser; // Did not trigger $onChanges()
    this.historyService.historyItemsForUserGet(selectedUser._id)
      .then(historyItems => {
        this.historyItems = historyItems;
        return null; // since we set component properties instead
      })
      .catch(response => console.error('Error', response));
  }

  historyHide() {
    this.historyItems = [];
  }

  historyItemEdit(historyItem) {
    this.modalHistoryEditor(historyItem);
  }

  historyItemDelete(historyItem) {
    this.historyService.historyItemDelete(historyItem)
      .then(() => {
        this.historyItems.splice(this.historyItems.indexOf(historyItem), 1); // Remove history item from the array
        this.user.balance -= historyItem.quantity;
        return null; // resolve promise
      })
      .catch(response => console.error('Error', response));
  }
}
