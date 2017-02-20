/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

/*global jQuery */
(function (cwApi, $) {

    "use strict";
    // constructor
    var cwTernaryTable = function () {
        this.label1;
        this.label2;
        this.label3;
        this.lines = {};
    };


    cwTernaryTable.prototype.parseObjects = function (child,data1,data2) {
        var nextChild = null;
        var data = {};


        if(child.hasOwnProperty('associations')) {
            for(var associationNode in child.associations) {
                if (child.associations.hasOwnProperty(associationNode)) {
                    for (var i = 0; i < child.associations[associationNode].length; i += 1) {
                        nextChild = child.associations[associationNode][i];
                        this.addlabel(nextChild.objectTypeScriptName);
                        data.id = nextChild.object_id;
                        data.name = nextChild.name;
                        if(data1 && data2) {
                            this.addline($.extend(true, {}, data1),$.extend(true, {}, data2),$.extend(true, {}, data));
                        }
                        else if(data1) this.parseObjects(nextChild,data1,data);
                        else this.parseObjects(data);
                    }
                }
            }
        } else {
            for (var i = 0; i < child.length; i += 1) {
                nextChild = child[i];
                this.addlabel(nextChild.objectTypeScriptName);
                data.id = nextChild.object_id;
                data.name = nextChild.name;
                this.parseObjects(nextChild,data);
            }
        }      
    };



    cwTernaryTable.prototype.addlabel = function (label) {
        if(this.label1 === undefined) {
            this.label1 = label;
        } else if(this.label2 === undefined) {
            this.label2 = label;
        } else if(this.label3 === undefined) {
            this.label3 = label;
        }
    };

    cwTernaryTable.prototype.addline = function (data1,data2,data3) {
        this.lines[data1.id + "#" + data2.id + "#" + data3.id] = [data1,data2,data3];
    };

    cwTernaryTable.prototype.addActiveLine = function (line) {
        this.addline(line[0],line[1],line[2]);
    };

    cwTernaryTable.prototype.removeActiveLine = function (line) {
        delete this.lines[line[0].id + "#" + line[1].id + "#" + line[2].id];
    };


    cwTernaryTable.prototype.getTableObject = function (classname) {
        var i,id,td,table,th,tr;
        table = document.createElement('table');
        table.className = classname;
        tr = document.createElement('tr');
        th = document.createElement('th');
        th.textContent = this.label1;
        tr.appendChild(th);
        th = document.createElement('th');
        th.textContent = this.label2;
        tr.appendChild(th);
        th = document.createElement('th');
        th.textContent = this.label3;
        tr.appendChild(th);
        table.appendChild(tr);

        for (id in this.lines) {
            if (this.lines.hasOwnProperty(id)) {
                tr = document.createElement('tr');
                for (i = 0; i < this.lines[id].length; i += 1) {
                    td = document.createElement('td');
                    td.id = this.lines[id][i].id;
                    td.className = "ternaryColumn_" + i;
                    td.textContent = this.lines[id][i].name;
                    tr.appendChild(td);
                }

                var button = document.createElement("input");
                button.setAttribute('type','submit'); 
                button.value = "Supprimer";
                button.id = id;
                var that = this;
                button.addEventListener("click", function() {
                    var newEvent = document.createEvent('Event');
                    newEvent.line = that.lines[this.id] ;
                    newEvent.initEvent('Remove Item', true, true);
                    this.dispatchEvent(newEvent);
                });
                td = document.createElement('td');
                td.appendChild(button);
                tr.appendChild(td);
                table.appendChild(tr);
            }
        }

        return table;



        // var result = document.createElement("div");

        // var button = document.createElement("input");
        // button.setAttribute('type','submit');   
        // button.addEventListener("click", function() {
        // if(that.lock === false) {
        //     that.lock = true;
        //     that.getTernaryURL();    
        // }

        // });
        // container.appendChild(button);

    };

    if(!cwApi.customLibs) {
        cwApi.customLibs = {};
    }
    if(!cwApi.customLibs.cwTernaryCreation){
        cwApi.customLibs.cwTernaryCreation = {};
    };
    if(!cwApi.customLibs.cwTernaryCreation.cwTernaryTable){
        cwApi.customLibs.cwTernaryCreation.cwTernaryTable = cwTernaryTable;
    };

}(cwAPI, jQuery));