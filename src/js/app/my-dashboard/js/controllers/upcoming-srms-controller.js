/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the upcoming srms widget
 */
(function () {

  /**
   * Create upcoming srm widget controller
   */
  angular
    .module('myDashboard')
    .controller('UpcomingSRMsCtrl', UpcomingSRMsCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  UpcomingSRMsCtrl.$inject = ['$scope', 'SRMService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param SRMServices services to access topcoder API for SRM data
   * @constructor
   */
  function UpcomingSRMsCtrl($scope, SRMService) {
    var vm = this;
    vm.loading = true;
    vm.pageIndex = 1;
    vm.pageSize = 2;
    vm.totalPages = 1;
    vm.totalRecords = vm.totalPages * vm.pageSize;
    vm.firstRecordIndex = (vm.pageIndex - 1) * vm.pageSize + 1;
    vm.lastRecordIndex = vm.totalPages * vm.pageSize;
    vm.pageLinks = [];
    vm.prevPageLink = {};
    vm.nextPageLink = {};
    vm.changePage = changePage;
    vm.isCurrentPage = isCurrentPage;
    vm.getCurrentPageClass = getCurrentPageClass;

    // activate controller
    activate();

    function activate() {
      initPaging();
      var searchRequest = {pageIndex: vm.pageIndex, pageSize: vm.pageSize};
      // start loading
      vm.loading = true;
      // Fetch the future srms scheduled
      return SRMService.getSRMSchedule(searchRequest)
        .then(function(data) {
          if (data.pagination) {
            vm.totalPages = Math.round(data.pagination.total / vm.pageSize);
            console.log(vm.totalPages);
            vm.totalRecords = data.pagination.total;
            vm.firstRecordIndex = (vm.pageIndex - 1) * vm.pageSize + 1;
            vm.lastRecordIndex = vm.pageIndex * vm.pageSize;
            vm.lastRecordIndex = vm.lastRecordIndex > vm.totalRecords ? vm.totalRecords : vm.lastRecordIndex;
          }
          vm.upcomingSRMs = data;
          vm.loading = false;
      });
    }

    function changePage(pageLink) {
      console.log(vm.pageIndex);
      vm.pageIndex = pageLink.val;
      activate();
    }

    function isCurrentPage (pageLink) {
      return pageLink.val === vm.pageIndex;
    }

    function getCurrentPageClass(pageLink) {
      return isCurrentPage(pageLink) ? 'current-page' : '';
    }

    function initPaging() {
      vm.prevPageLink = {text: "Prev", val: vm.pageIndex - 1};
      vm.nextPageLink = {text: "Next", val: vm.pageIndex + 1};
    }
  }


})();