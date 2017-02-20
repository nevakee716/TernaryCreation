/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */
/*global cwAPI, jQuery*/

(function (cwApi, $) {
    'use strict';
    var cwTernaryCreation;

    cwTernaryCreation = function (options, viewSchema) {
      this.viewSchema = viewSchema;

      if(options.CustomOptions.hasOwnProperty('replace-layout')) {
        this.replaceLayout = options.CustomOptions['replace-layout'];
        cwApi.extend(this, cwApi.cwLayouts[this.replaceLayout], options, viewSchema);
      } else {
        cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);        
      }

      this.cwTernaryTable = new cwApi.customLibs.cwTernaryCreation.cwTernaryTable(); 
      this.NodesFilter1 = new cwApi.customLibs.cwTernaryCreation.nodeFilter(true,'NodesFilter1'); 
      this.NodesFilter2 = new cwApi.customLibs.cwTernaryCreation.nodeFilter(true,'NodesFilter2'); 
      this.EvodUrl = this.options.CustomOptions['EVOD-url'];
      this.drawOneMethod = cwApi.cwLayouts.cwLayoutList.drawOne.bind(this);
      cwApi.registerLayoutForJSActions(this);
      this.lockState = false;
    };

    cwTernaryCreation.prototype.drawAssociations = function (output, associationTitleText, object) {
      output.push('<div id="cwTernaryCreation" class="bootstrap-iso" style= "display: flex"></div></div><div id="cwTernaryTable">');
      this.cwTernaryTable.parseObjects([object]);

      if(cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations) {
          cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations.call(this,output, associationTitleText, object);
      } else {
          cwApi.cwLayouts.CwLayout.prototype.drawAssociations.call(this,output, associationTitleText, object);
      }
      output.push('</div>');
    };

    cwTernaryCreation.prototype.getThirdLvlNode = function () {
      var nodes,key;
      if(this.viewSchema.NodesByID[this.mmNode.NodeID].SortedChildren[0]){
        return this.viewSchema.NodesByID[this.viewSchema.NodesByID[this.mmNode.NodeID].SortedChildren[0].NodeId].ObjectTypeScriptName;
      }
    };

    cwTernaryCreation.prototype.getObjects = function () {
      var sendData = {};
      var propertiesToSelect = ["NAME","ID"];
      var that = this;
      var callbackCount = 0;

      var objectTypeScriptName1 = this.viewSchema.NodesByID[this.mmNode.NodeID].ObjectTypeScriptName.toUpperCase();
      sendData.objectTypeScriptName = objectTypeScriptName1;
      sendData.propertiesToSelect = propertiesToSelect;   

      cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function (update) {
        var object1;
        if(update && update.hasOwnProperty(objectTypeScriptName1.toLowerCase())) {
          for (var i = 0 ; i < update[objectTypeScriptName1.toLowerCase()].length; i++) {
            object1 = update[objectTypeScriptName1.toLowerCase()][i];
            if(object1.hasOwnProperty('properties') && object1.properties.hasOwnProperty("name") && object1.properties.hasOwnProperty("id")) {
              that.NodesFilter1.addfield(objectTypeScriptName1,object1.properties["name"],object1.properties["id"]);
            }
          }
          callbackCount = callbackCount + 1;
        }
        
        if(callbackCount === 2) {
          that.createFilters();
        }
      });

      var objectTypeScriptName2 = this.getThirdLvlNode();
      sendData.objectTypeScriptName = objectTypeScriptName2;
      
      cwApi.cwEditProperties.GetObjectsByScriptName(sendData, function (update) {
        var object2; 
        if(update && update.hasOwnProperty(objectTypeScriptName2.toLowerCase())) {
          for (var i = 0 ; i < update[objectTypeScriptName2.toLowerCase()].length; i++) {
            object2 = update[objectTypeScriptName2.toLowerCase()][i];
            if(object2.hasOwnProperty('properties') && object2.properties.hasOwnProperty("name") && object2.properties.hasOwnProperty("id")) {
              that.NodesFilter2.addfield(objectTypeScriptName2,object2.properties["name"],object2.properties["id"]);
            }
          }
          callbackCount = callbackCount + 1 ;
        }

        if(callbackCount === 2) {
          that.createFilters();
        }
      });
    };


    cwTernaryCreation.prototype.createFilters = function () {
      var classname = 'customTernaryLayoutFilter';
        var container = document.getElementById("cwTernaryCreation");
        var node;
        var that = this;
        if(container){
          container.appendChild(this.NodesFilter1.getFilterObject(classname));
          container.appendChild(this.NodesFilter2.getFilterObject(classname));
          var result = document.createElement("div");

          var button = document.createElement("input");
          button.setAttribute('type','submit');  
          button.value = "Ajouter"; 
          button.addEventListener("click", function() {
              if(that.isLocked() === false) {
                that.lock();
                that.getCreationTernaryUrl();    
              }

          });
          container.appendChild(button);
        }
      };


    cwTernaryCreation.prototype.getCreationTernaryUrl = function () {
      var url = this.EvodUrl + "ternarycreation?model=" + cwAPI.cwConfigs.ModelFilename;
      url = url + "&ot0=" + this.item.objectTypeScriptName + "&id0=" + this.item.object_id;
      url = url + "&ot1=" + this.NodesFilter1.label + "&id1=" + this.NodesFilter1.selectedId;
      url = url + "&ot2=" + this.NodesFilter2.label + "&id2=" + this.NodesFilter2.selectedId;  
      url = url + "&command=create"; 

      var line = [{},{},{}];
      line[0].id = this.item.object_id;
      line[0].name = this.item.name;
      line[1].id = this.NodesFilter1.selectedId;
      line[1].name = this.NodesFilter1.selectedName;
      line[2].id = this.NodesFilter2.selectedId;
      line[2].name = this.NodesFilter2.selectedName;
      var that = this;
      this.sendTernaryRequest(url,function() {
        that.cwTernaryTable.addActiveLine(line);
        that.createTable();
      });
    };


    cwTernaryCreation.prototype.getRemoveTernaryUrl = function (line) {
      var url = this.EvodUrl + "ternarycreation?model=" + cwAPI.cwConfigs.ModelFilename;
      url = url + "&ot0=" + this.item.objectTypeScriptName + "&id0=" + line[0].id;
      url = url + "&ot1=" + this.NodesFilter1.label + "&id1="  + line[1].id;
      url = url + "&ot2=" + this.NodesFilter2.label + "&id2="  + line[2].id; 
      url = url + "&command=delete"; 
      var that = this;
      this.sendTernaryRequest(url,function() {
        that.cwTernaryTable.removeActiveLine(line);
        that.createTable();
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
          }
        } else {
          cwApi.notificationManager.addNotification('Failed to contact EvolveOnDemand','error');
        }
        that.unlock();
      });

    };


    cwTernaryCreation.prototype.createTable = function () {

        var container = document.getElementById("cwTernaryTable");
        var node;
        var className = "ternaryRemovalTable";
        $('.' + className).remove();
        var that = this;
        var table = this.cwTernaryTable.getTableObject(className);
        if(container){
          container.appendChild(table);
          table.addEventListener('Remove Item', function(event) { 
            if(that.isLocked() === false) {
              that.lock();
              that.getRemoveTernaryUrl(event.line);
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
        this.getObjects();
        this.createTable();
    };

 

    cwApi.cwLayouts.cwTernaryCreation = cwTernaryCreation;

}(cwAPI, jQuery));