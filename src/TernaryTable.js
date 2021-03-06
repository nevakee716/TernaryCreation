/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

/*global jQuery */
(function(cwApi, $) {

  "use strict";
  // constructor
  var cwTernaryTable = function() {
    this.lines = [];
    this.NodesFilter0 = new cwApi.customLibs.cwTernaryCreation.nodeFilter();
    this.NodesFilter1 = new cwApi.customLibs.cwTernaryCreation.nodeFilter();
    this.NodesFilter2 = new cwApi.customLibs.cwTernaryCreation.nodeFilter();
  };



  cwTernaryTable.prototype.addline = function(data0, data1, data2) {
    if(data1.label && data2.label) {
      var ots0 = 'cwview=' + this.NodesFilter0.objectTypeScriptName.toLowerCase();
      var ots1 = 'cwview=' + this.NodesFilter1.objectTypeScriptName.toLowerCase();
      var ots2 = 'cwview=' + this.NodesFilter2.objectTypeScriptName.toLowerCase();     
      if(cwApi.isIndexPage && !cwApi.isIndexPage()) {
        data2.label = data2.label.replace(ots1,ots2);
      } else 
      {
        data1.label = data1.label.replace(ots0,ots1);
        data2.label = data2.label.replace(ots0,ots2);
      }
    }

    var line = {};
    line.name0 = data0.name;
    line.label0 = data0.label;     
    line.id0 = data0.id;
    line.name1 = data1.name;
    line.label1 = data1.label;
    line.id1 = data1.id;
    line.name2 = data2.name;
    line.label2 = data2.label;
    line.id2 = data2.id;

    //this.lines.push([data0, data1, data2]);
    this.lines.push(line);
  };

  cwTernaryTable.prototype.addLineAndRefresh = function(line) {
    for (var i = 0; i < this.lines.length; i++) {
      if(this.lines[i].id0 === line[0].id && this.lines[i].id1 === line[1].id && this.lines[i].id2 === line[2].id) {
        cwApi.notificationManager.addNotification('Ternary was already existed');
        return;
      }
    }
    line[0].label = line[0].name ;
    line[1].label = line[1].name ;
    line[2].label = line[2].name ;
    this.addline(line[0], line[1], line[2]);
    this.refresh();
  };

  cwTernaryTable.prototype.removeLine = function(lineToRemove) {
    for (var i = 0; i < this.lines.length; i++) {
      if(this.lines[i] === lineToRemove) {
        this.lines.splice(i, 1);
        return;
      }
    }
  };

  cwTernaryTable.prototype.createAngularTable = function($container, container, item) {
    var loader = cwApi.CwAngularLoader,
      templatePath;
    loader.setup();
    var that = this;



    templatePath = cwAPI.getCommonContentPath() + '/html/angularLayouts/cwLayoutAngularTable.ng.html' + '?' + Math.random();

    loader.loadControllerWithTemplate('abc', $container, templatePath, function($scope, $filter, $sce) {
      that.scope = $scope;
      $scope.lines = that.lines;
      $scope.getLabel0 = function() {
        return that.NodesFilter0.label.charAt(0).toUpperCase() + that.NodesFilter0.label.slice(1);
      };
      $scope.getLabel1 = function() {
        return that.NodesFilter1.label.charAt(0).toUpperCase() + that.NodesFilter1.label.slice(1);
      };
      $scope.getLabel2 = function() {
        return that.NodesFilter2.label.charAt(0).toUpperCase() + that.NodesFilter2.label.slice(1);
      };

      $scope.ot0Objects = that.NodesFilter0.filterField;
      $scope.ot1Objects = that.NodesFilter1.filterField;
      $scope.ot2Objects = that.NodesFilter2.filterField;


      $scope.getSce = function(label) {
        if(label) {
          return $sce.trustAsHtml(label);
        }
      };

      $scope.add = function(data) {
        var newEvent = document.createEvent('Event');
        newEvent.data = data;
        newEvent.callback = function(lineToAdd,quickADD) {
          if(quickADD) that.addLineAndRefresh(lineToAdd);
          else that.reload();
        };
        newEvent.initEvent('Add Item', true, true);
        container.dispatchEvent(newEvent);
      };


      $scope.remove = function(data) {
        var newEvent = document.createEvent('Event');
        newEvent.data = data;
        newEvent.callback = function() {
          that.removeLine(data);
          $scope.$apply();
        };
        newEvent.initEvent('Remove Item', true, true);
        container.dispatchEvent(newEvent);
      };



      // in case of single Page, hide 1st column and preselect object
      if (cwAPI.isIndexPage && !cwAPI.isIndexPage()) {
        $scope.data = {};
        $scope.display = 'display:none';
        $scope.data['ot0'] = {};
        $scope.data['ot0']['id'] = item.object_id.toString();
      }

      $scope.sortColumn = "name0";
      $scope.reverseSort = false;

      $scope.sortData = function(column) {
        $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
        $scope.sortColumn = column;
      };

      $scope.getSortClass = function (column) {
        if($scope.sortColumn == column) {
          return $scope.reverseSort ? 'arrow-down' : 'arrow-up';
        }
        return '';
      };


      $scope.ExportCsv = function() {
        var table = container.firstChild;
        var csvString = '';
        for (var i = 0; i < table.rows.length; i++) {
          if(i !== 1) {
            var rowData = table.rows[i].cells;
            for (var j = 0; j < rowData.length - 1; j++) {
              csvString = csvString + rowData[j].innerText + ";";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            csvString = csvString + "\n";
          }
        }
        csvString = csvString.substring(0, csvString.length - 1);
        var a = $('<a/>', {
          style: 'display:none',
          href: 'data:application/octet-stream;base64,' + btoa(csvString),
          download: 'export.csv'
        }).appendTo('body');
        a[0].click();
        a.remove();
      };

    });
  };


  cwTernaryTable.prototype.refresh = function() {
    if (this.scope) {
      this.scope.$apply();
    }
  };


  cwTernaryTable.prototype.reload = function() {
    if (location) {
      location.reload();
    }
  };


  if (!cwApi.customLibs) {
    cwApi.customLibs = {};
  }
  if (!cwApi.customLibs.cwTernaryCreation) {
    cwApi.customLibs.cwTernaryCreation = {};
  };
  if (!cwApi.customLibs.cwTernaryCreation.cwTernaryTable) {
    cwApi.customLibs.cwTernaryCreation.cwTernaryTable = cwTernaryTable;
  };

}(cwAPI, jQuery));