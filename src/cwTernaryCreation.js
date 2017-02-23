/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */
/*global cwAPI, jQuery*/

(function (cwApi, $) {
    'use strict';
    var cwTernaryCreation;

    cwTernaryCreation = function (options, viewSchema) {
      this.viewSchema = viewSchema;
      cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);        

      this.cwTernaryTable = new cwApi.customLibs.cwTernaryCreation.cwTernaryTable(this.viewSchema); 
      cwApi.registerLayoutForJSActions(this);
      this.lockState = false;
    };

    cwTernaryCreation.prototype.drawAssociations = function (output, associationTitleText, object) {
      output.push('<div id="cwTernaryCreation" class="bootstrap-iso" style= "display: flex"></div></div><div id="cwTernaryTable"></div>');
      if(cwApi.isIndexPage()) {
        this.parseObjects(object);
      } else {
        this.parseObjects([object]);
      }
      this.getObjects();
    };

    cwTernaryCreation.prototype.parseObjects = function (child,data1,data2) {
        var nextChild = null;
        var data = {};
        if(child.hasOwnProperty('associations')) {
            for(var associationNode in child.associations) {
                if (child.associations.hasOwnProperty(associationNode)) {
                    for (var i = 0; i < child.associations[associationNode].length; i += 1) {
                        nextChild = child.associations[associationNode][i];
                        data.id = nextChild.object_id;
                        data.name = nextChild.name;
                        data.label = this.getDisplayItem(nextChild);
                        if(data1 && data2) {
                            this.cwTernaryTable.addline($.extend(true, {}, data1),$.extend(true, {}, data2),$.extend(true, {}, data));
                        }
                        else if(data1) this.parseObjects(nextChild,data1,data);
                        else this.parseObjects(nextChild,data);
                    }
                }
            }
        } else {
            for (var i = 0; i < child.length; i += 1) {
                nextChild = child[i];
                data.id = nextChild.object_id;
                data.name = nextChild.name;
                this.parseObjects(nextChild,data);
            }
        }     
    };





    cwTernaryCreation.prototype.getSecondLvlNode = function () {
      var nodes,key;
      if(this.viewSchema.NodesByID[this.mmNode.NodeID].SortedChildren[0]){
        return this.viewSchema.NodesByID[this.viewSchema.NodesByID[this.mmNode.NodeID].SortedChildren[0].NodeId].ObjectTypeScriptName;
      }
    };

    cwTernaryCreation.prototype.getThirdLvlNode = function () {
      var nodes,key,sonNode,grdSonNode;
      sonNode = this.viewSchema.NodesByID[this.mmNode.NodeID].SortedChildren[0].NodeId;
      if(sonNode && this.viewSchema.NodesByID[sonNode].SortedChildren[0]){
        grdSonNode = this.viewSchema.NodesByID[sonNode].SortedChildren[0].NodeId;
        return this.viewSchema.NodesByID[grdSonNode].ObjectTypeScriptName;
      }
    };

    cwTernaryCreation.prototype.getObjects = function () {
      var objectTypeScriptName0,objectTypeScriptName1,objectTypeScriptName2;

      if(cwApi.isIndexPage()) {
        objectTypeScriptName0 = this.viewSchema.NodesByID[this.mmNode.NodeID].ObjectTypeScriptName.toUpperCase();
        objectTypeScriptName1 = this.getSecondLvlNode();
        objectTypeScriptName2 = this.getThirdLvlNode();
      } else {
        objectTypeScriptName0 = this.item.objectTypeScriptName.toUpperCase();
        objectTypeScriptName1 = this.viewSchema.NodesByID[this.mmNode.NodeID].ObjectTypeScriptName.toUpperCase();
        objectTypeScriptName2 = this.getSecondLvlNode();
      }

      this.cwTernaryTable.getObjects(objectTypeScriptName0,objectTypeScriptName1,objectTypeScriptName2);
    };



    cwTernaryCreation.prototype.getCreationTernaryUrl = function (data,callback) {
      if(data && data.hasOwnProperty('ot0') && data.ot0 && data.hasOwnProperty('ot1') && data.ot1 && data.hasOwnProperty('ot2') && data.ot2) {
        var id0 = data.ot0;
        var id1 = data.ot1;
        var id2 = data.ot2;
        var url = this.options.CustomOptions['EVOD-url'] + "ternarycreation?model=" + cwAPI.cwConfigs.ModelFilename;
        url = url + "&ot0=" + this.cwTernaryTable.NodesFilter0.label + "&id0=" + id0;
        url = url + "&ot1=" + this.cwTernaryTable.NodesFilter1.label + "&id1=" + id1;
        url = url + "&ot2=" + this.cwTernaryTable.NodesFilter2.label + "&id2=" + id2;
        url = url + "&command=create"; 

        var line = [{},{},{}];
        line[0].id = id0;
        line[0].name = this.cwTernaryTable.NodesFilter0.filterField[data.ot0].name;
        line[1].id = id1;
        line[1].name = this.cwTernaryTable.NodesFilter1.filterField[data.ot1].name;
        line[2].id = id2;
        line[2].name = this.cwTernaryTable.NodesFilter2.filterField[data.ot2].name;

        this.sendTernaryRequest(url,function() {
          callback(line);
        });
      }
      else {
        this.unlock();
        cwApi.notificationManager.addNotification("Please Select All fields",'error'); 
      }
    };


    cwTernaryCreation.prototype.getRemoveTernaryUrl = function (line,callback) {
      var url = this.options.CustomOptions['EVOD-url'] + "ternarycreation?model=" + cwAPI.cwConfigs.ModelFilename;
      url = url + "&ot0=" + this.cwTernaryTable.NodesFilter0.label + "&id0=" + line[0].id;
      url = url + "&ot1=" + this.cwTernaryTable.NodesFilter1.label + "&id1="  + line[1].id;
      url = url + "&ot2=" + this.cwTernaryTable.NodesFilter2.label + "&id2="  + line[2].id; 
      url = url + "&command=delete"; 
      var that = this;
      this.sendTernaryRequest(url,function() {
        that.unlock();
        callback();
      });
    };



    cwTernaryCreation.prototype.sendTernaryRequest = function (url,callback) {
      var that = this;
      cwApi.cwDoGETQuery('Failed to contact EvolveOnDemand', url, function(data){
        if(data !== 'Failed to contact EvolveOnDemand') {
          if(data.status === 'Ok') {
            cwApi.notificationManager.addNotification(data.result);
            callback();
          } else {
            cwApi.notificationManager.addNotification(data.result,'error');
            that.unlock();
          }
        } else {
          cwApi.notificationManager.addNotification('Failed to contact EvolveOnDemand','error');
          that.unlock();
        }
      });

    };


    cwTernaryCreation.prototype.createTable = function () {
        var container = document.getElementById("cwTernaryTable");
        var $container = $('#cwTernaryTable');
        var node;
        var className = "ternaryRemovalTable";
        $('.' + className).remove();
        var that = this;
        if($container){
          this.cwTernaryTable.createAngularTable($container,container,this.item);
          container.addEventListener('Remove Item', function(event) { 
            if(that.isLocked() === false) {
              that.lock();
              that.getRemoveTernaryUrl(event.line,event.callback);
            }
          });

          container.addEventListener('Add Item', function(event) { 
            if(that.isLocked() === false) {
              that.lock();
              that.getCreationTernaryUrl(event.data,event.callback);
            }
          });
        }
      };

    cwTernaryCreation.prototype.lock = function () {
      this.lockState = true;
      cwApi.setMouseToLoading();
      $('.cwloading').show();
    };

    cwTernaryCreation.prototype.unlock = function () {
      this.lockState = false;
      cwApi.setMouseToDefault();
      $('.cwloading').hide();      
    };

    cwTernaryCreation.prototype.isLocked = function () {
      return this.lockState;
    };

    cwTernaryCreation.prototype.applyJavaScript = function () {
        var that = this;
        cwApi.CwAsyncLoader.load('angular', function () {
          that.createTable();
        });
    };

 

    cwApi.cwLayouts.cwTernaryCreation = cwTernaryCreation;

}(cwAPI, jQuery));