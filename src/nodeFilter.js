/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

/*global jQuery */
(function (cwApi, $) {

    "use strict";
    // constructor
    var nodeFilter = function () {
        this.filterField = [];
        this.label = "";
        this.selectedId;
        this.selectedName;

    };

    nodeFilter.prototype.addfield = function (otScriptName,name,id) {
        var element = {};

        element.id = id;
        element.name = name;

        this.filterField.push(element);
        
        if(!this.label) {
            this.label = otScriptName;
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



    nodeFilter.prototype.getObjectWithId = function (id) {
        var i;
        for (i = 0; i < this.filterField.length; i += 1) {
            if(this.filterField[i].id === id) {
                return this.filterField[i];
            }
        }
        return undefined;
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