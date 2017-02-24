/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

/*global jQuery */
(function(cwApi, $) {

  "use strict";
  // constructor
  var cwTernaryTable = function() {
    this.label0;
    this.label1;
    this.label2;
    this.lines = {};
    this.NodesFilter0 = new cwApi.customLibs.cwTernaryCreation.nodeFilter(true, 'NodesFilter0');
    this.NodesFilter1 = new cwApi.customLibs.cwTernaryCreation.nodeFilter(true, 'NodesFilter1');
    this.NodesFilter2 = new cwApi.customLibs.cwTernaryCreation.nodeFilter(true, 'NodesFilter2');
  };



  cwTernaryTable.prototype.getObjects = function(objectTypeScriptName0, objectTypeScriptName1, objectTypeScriptName2) {
    var sendData = {};
    var propertiesToSelect = ["NAME", "ID"];
    var that = this;
    var callbackCount = 0;

    this.addlabel(objectTypeScriptName0);
    this.addlabel(objectTypeScriptName1);
    this.addlabel(objectTypeScriptName2);


    sendData.objectTypeScriptName = objectTypeScriptName0;
    sendData.propertiesToSelect = propertiesToSelect;

    cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function(update) {
      var object0;
      if (update && update.hasOwnProperty(objectTypeScriptName0.toLowerCase())) {
        for (var i = 0; i < update[objectTypeScriptName0.toLowerCase()].length; i++) {
          object0 = update[objectTypeScriptName0.toLowerCase()][i];
          if (object0.hasOwnProperty('properties') && object0.properties.hasOwnProperty("name") && object0.properties.hasOwnProperty("id")) {
            that.NodesFilter0.addfield(objectTypeScriptName0, object0.properties["name"], object0.properties["id"]);
          }
        }
        callbackCount = callbackCount + 1;
      }

      if (callbackCount === 3) {
        that.refresh();
      }
    });

    sendData.objectTypeScriptName = objectTypeScriptName1;
    cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function(update) {
      var object1;
      if (update && update.hasOwnProperty(objectTypeScriptName1.toLowerCase())) {
        for (var i = 0; i < update[objectTypeScriptName1.toLowerCase()].length; i++) {
          object1 = update[objectTypeScriptName1.toLowerCase()][i];
          if (object1.hasOwnProperty('properties') && object1.properties.hasOwnProperty("name") && object1.properties.hasOwnProperty("id")) {
            that.NodesFilter1.addfield(objectTypeScriptName1, object1.properties["name"], object1.properties["id"]);
          }
        }
        callbackCount = callbackCount + 1;
      }

      if (callbackCount === 3) {
        that.refresh();
      }
    });

    sendData.objectTypeScriptName = objectTypeScriptName2;
    cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function(update) {
      var object2;
      if (update && update.hasOwnProperty(objectTypeScriptName2.toLowerCase())) {
        for (var i = 0; i < update[objectTypeScriptName2.toLowerCase()].length; i++) {
          object2 = update[objectTypeScriptName2.toLowerCase()][i];
          if (object2.hasOwnProperty('properties') && object2.properties.hasOwnProperty("name") && object2.properties.hasOwnProperty("id")) {
            that.NodesFilter2.addfield(objectTypeScriptName2, object2.properties["name"], object2.properties["id"]);
          }
        }
        callbackCount = callbackCount + 1;
      }

      if (callbackCount === 3) {
        that.refresh();
      }
    });
  };

  cwTernaryTable.prototype.addlabel = function(label) {
    if (this.label0 === undefined) {
      this.label0 = label;
    } else if (this.label1 === undefined) {
      this.label1 = label;
    } else if (this.label2 === undefined) {
      this.label2 = label;
    }
  };

  cwTernaryTable.prototype.addline = function(data0, data1, data2) {
    if(data1.label && data2.label) {
      data1.label = data1.label.replace('cwview=' + this.label0.toLowerCase(),'cwview=' +this.label1.toLowerCase());
      data2.label = data2.label.replace('cwview=' + this.label0.toLowerCase(),'cwview=' +this.label2.toLowerCase());
    }
    this.lines[data0.id + "#" + data1.id + "#" + data2.id] = [data0, data1, data2];
  };

  cwTernaryTable.prototype.addLineAndRefresh = function(line) {
    this.addline(line[0], line[1], line[2]);
    this.refresh();
  };

  cwTernaryTable.prototype.removeLine = function(line) {
    delete this.lines[line[0].id + "#" + line[1].id + "#" + line[2].id];
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
        return that.label0;
      };
      $scope.getLabel1 = function() {
        return that.label1;
      };
      $scope.getLabel2 = function() {
        return that.label2;
      };

      $scope.ot0Objects = that.NodesFilter0.filterField;
      $scope.ot1Objects = that.NodesFilter1.filterField;
      $scope.ot2Objects = that.NodesFilter2.filterField;



      // in case of single Page, hide 1st column and preselect object
      if (!cwAPI.isIndexPage()) {
        $scope.data = {};
        $scope.display = 'display:none;';
        $scope.data['ot0'] = item.object_id.toString();
      }

      $scope.getCustomDisplayString = function(index, key) {
        return $sce.trustAsHtml(that.lines[key][index].label);
      };

      $scope.add = function(data) {
        var newEvent = document.createEvent('Event');
        newEvent.data = data;
        newEvent.callback = function(lineToAdd) {
          that.addLineAndRefresh(lineToAdd);
          that.reload();
        };
        newEvent.initEvent('Add Item', true, true);
        container.dispatchEvent(newEvent);
      };


      $scope.remove = function(item) {
        var newEvent = document.createEvent('Event');
        newEvent.line = that.lines[item];
        newEvent.callback = function() {
          that.removeLine(that.lines[item]);
          $scope.$apply();
        };
        newEvent.initEvent('Remove Item', true, true);
        container.dispatchEvent(newEvent);
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