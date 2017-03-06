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

      this.removeTernary = this.removeTernary.bind(this);
      this.createTernary = this.createTernary.bind(this); 
    };

    cwTernaryCreation.prototype.drawAssociations = function (output, associationTitleText, object) {
      output.push('<div id="cwTernaryCreation" class="bootstrap-iso" style= "display: flex"></div></div><div id="cwTernaryTable"></div>');

      var objectTypeScriptName0,objectTypeScriptName1,objectTypeScriptName2;

      if((cwApi.isIndexPage && cwApi.isIndexPage()) || this.item.objectTypeScriptName === undefined) {
        this.cwTernaryTable.NodesFilter0.objectTypeScriptName = this.viewSchema.NodesByID[this.mmNode.NodeID].ObjectTypeScriptName.toUpperCase();
        this.cwTernaryTable.NodesFilter1.objectTypeScriptName = this.getSecondLvlNode();
        this.cwTernaryTable.NodesFilter2.objectTypeScriptName = this.getThirdLvlNode();
      } else {
        this.cwTernaryTable.NodesFilter0.objectTypeScriptName = this.item.objectTypeScriptName.toUpperCase();
        this.cwTernaryTable.NodesFilter1.objectTypeScriptName = this.viewSchema.NodesByID[this.mmNode.NodeID].ObjectTypeScriptName.toUpperCase();
        this.cwTernaryTable.NodesFilter2.objectTypeScriptName = this.getSecondLvlNode();
      }     

      if((cwApi.isIndexPage && cwApi.isIndexPage()) || this.item.objectTypeScriptName === undefined){
        this.parseObjects(object);
      } else {
        this.parseObjects([object]);
      }
      this.getObjectFromObjectypes(this.cwTernaryTable.NodesFilter0.objectTypeScriptName,this.cwTernaryTable.NodesFilter1.objectTypeScriptName,this.cwTernaryTable.NodesFilter2.objectTypeScriptName,this.item);
      
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
                        if(data.label === "") {
                          data.label = data.name;
                        }
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
                data.label = this.getDisplayItem(nextChild);                    
                if(data.label === "") {
                  data.label = data.name;
                }
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

   cwTernaryCreation.prototype.getObjectFromObjectypes = function(objectTypeScriptName0, objectTypeScriptName1, objectTypeScriptName2,item) {
      var sendData = {};
      var propertiesToSelect = ["NAME", "ID"];
      var that = this;
      var callbackCount = 0;

      sendData.objectTypeScriptName = objectTypeScriptName0;
      sendData.propertiesToSelect = propertiesToSelect;

      cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function(update) {
        var object0;
        for(var key in update) {
          if(update.hasOwnProperty(key)) {
            callbackCount = callbackCount + 1;
            for (var i = 0; i < update[key].length; i++) {
              object0 = update[key][i];
                if (object0.hasOwnProperty('properties') && object0.properties.hasOwnProperty("name") && object0.properties.hasOwnProperty("id")) {
                  that.cwTernaryTable.NodesFilter0.addfield(key, object0.properties["name"], object0.properties["id"]);
                  that.cwTernaryTable.NodesFilter0.label = key;
                } 
            }
          }
        }
        if (callbackCount === 3) {
          that.createTable();
        }
      });

      sendData.objectTypeScriptName = objectTypeScriptName1;
      cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function(update) {
        var object1;
        for(var key in update) {
          if(update.hasOwnProperty(key)) {
            callbackCount = callbackCount + 1;
            for (var i = 0; i < update[key].length; i++) {
              object1 = update[key][i];
                if (object1.hasOwnProperty('properties') && object1.properties.hasOwnProperty("name") && object1.properties.hasOwnProperty("id")) {
                  that.cwTernaryTable.NodesFilter1.addfield(key, object1.properties["name"], object1.properties["id"]);
                  that.cwTernaryTable.NodesFilter1.label = key;
                } 
            }
          }
        }
        if (callbackCount === 3) {
          that.createTable();
        }
      });

      sendData.objectTypeScriptName = objectTypeScriptName2;
      cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function(update) {
        var object2;
        for(var key in update) {
          if(update.hasOwnProperty(key)) {
            callbackCount = callbackCount + 1;
            for (var i = 0; i < update[key].length; i++) {
              object2 = update[key][i];
                if (object2.hasOwnProperty('properties') && object2.properties.hasOwnProperty("name") && object2.properties.hasOwnProperty("id")) {
                  that.cwTernaryTable.NodesFilter2.addfield(key, object2.properties["name"], object2.properties["id"]);
                  that.cwTernaryTable.NodesFilter2.label = key;
                } 
            }
          }
        }
        if (callbackCount === 3) {
          that.createTable();
        }
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
        container.removeEventListener('Remove Item', this.removeTernary);   
        container.removeEventListener('Add Item', this.createTernary);   
        this.cwTernaryTable.createAngularTable($container,container,this.item);
        if(container){
          container.addEventListener('Remove Item', this.removeTernary);  
          container.addEventListener('Add Item', this.createTernary); 
        }
      };

    cwTernaryCreation.prototype.createTernary = function (event) {
      if(this.isLocked() === false && event.callback) {
        if(event.data && event.data.hasOwnProperty('ot0') && event.data.ot0 && event.data.hasOwnProperty('ot1') && event.data.ot1 && event.data.hasOwnProperty('ot2') && event.data.ot2) {
          var id0 = event.data.ot0.id;
          var id1 = event.data.ot1.id;
          var id2 = event.data.ot2.id;
          var url = this.options.CustomOptions['EVOD-url'] + "ternarycreation?model=" + cwAPI.cwConfigs.ModelFilename;
          url = url + "&ot0=" + this.cwTernaryTable.NodesFilter0.objectTypeScriptName + "&id0=" + id0;
          url = url + "&ot1=" + this.cwTernaryTable.NodesFilter1.objectTypeScriptName + "&id1=" + id1;
          url = url + "&ot2=" + this.cwTernaryTable.NodesFilter2.objectTypeScriptName + "&id2=" + id2;
          url = url + "&command=create"; 

          var line = [{},{},{}];
          line[0].id = id0;
          line[1].id = id1;
          line[2].id = id2;

          var that = this;
          this.sendTernaryRequest(url,function() {
            event.callback(line);
            that.unlock();
          });
        }
        else {
          this.unlock();
          cwApi.notificationManager.addNotification("Please Select All fields",'error'); 
        }
      }
    };



    cwTernaryCreation.prototype.removeTernary = function (event) {
      if(this.isLocked() === false && event.data && event.callback) {
        var url = this.options.CustomOptions['EVOD-url'] + "ternarycreation?model=" + cwAPI.cwConfigs.ModelFilename;
        url = url + "&ot0=" + this.cwTernaryTable.NodesFilter0.objectTypeScriptName + "&id0=" + event.data.id0;
        url = url + "&ot1=" + this.cwTernaryTable.NodesFilter1.objectTypeScriptName + "&id1="  + event.data.id1;
        url = url + "&ot2=" + this.cwTernaryTable.NodesFilter2.objectTypeScriptName + "&id2="  + event.data.id2; 
        url = url + "&command=delete"; 
        var that = this;
        this.sendTernaryRequest(url,function() {
          that.unlock();
          event.callback();
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