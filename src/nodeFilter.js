/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

/*global jQuery */
(function (cwApi, $) {

    "use strict";
    // constructor
    var nodeFilter = function () {
        this.filterField = {};
        this.label = "";
        this.selectedId;
        this.selectedName;

    };

    nodeFilter.prototype.addfield = function (otScriptName,name,id) {
        if(!this.filterField.hasOwnProperty(id)) {
            this.filterField[id] = {};
            this.filterField[id].name = name;
            this.filterField[id].state = false;
        }
        if(!this.label) {
            this.label = otScriptName;
        }
        if(!this.selectedId) {
            this.selectedId = id;
            this.selectedName = name;
        }
    };

    nodeFilter.prototype.show = function (id) {
        if(this.filterField.hasOwnProperty(id)) {
            this.selectedId = id;
            this.selectedName = this.filterField[id].name;
        }
    };

    nodeFilter.prototype.hide = function (id) {
        if(this.filterField.hasOwnProperty(id)) {
            this.selectedId = undefined;
            this.selectedName = undefined;
        }
    };
   

    nodeFilter.prototype.getFields = function (state) {
        var result = [];
        var id;
        for (id in this.filterField) {
            if (this.filterField.hasOwnProperty(id) && this.filterField[id].state === state) {
                result.push(id);
            }
        }    
        return result;
    };


    nodeFilter.prototype.setAllState = function (value) {
        var id;
        for (id in this.filterField) {
            if (this.filterField.hasOwnProperty(id)) {
               this.filterField[id].state = value;
            }
        }   
    };


    nodeFilter.prototype.getFilterObject = function (classname) {
        var filterObject;
        var object;
        var id;
        var that = this;

        filterObject = document.createElement("select");
        filterObject.setAttribute('size','1');

        
        filterObject.className = classname;
        filterObject.setAttribute('id',this.node);
        filterObject.addEventListener("change", function() {
            that.show(this.options[this.selectedIndex].id);
        });

        for (id in this.filterField) {
            if (this.filterField.hasOwnProperty(id)) {
                object = document.createElement("option");
                object.setAttribute('id',id);
                object.textContent = this.filterField[id].name;
                filterObject.appendChild(object);
            }                                                                                                                                                                                                                                                                                                                                                                                                            
        }
        return filterObject;
    };

    if(!cwApi.customLibs) {
        cwApi.customLibs = {};
    }
    if(!cwApi.customLibs.cwTernaryCreation){
        cwApi.customLibs.cwTernaryCreation = {};
    };
    if(!cwApi.customLibs.cwTernaryCreation.nodeFilter){
        cwApi.customLibs.cwTernaryCreation.nodeFilter = nodeFilter;
    };


}(cwAPI, jQuery));