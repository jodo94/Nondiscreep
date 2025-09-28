/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tick.Epoch');
 * mod.thing == 'a thing'; // true
 */

var goalpostRepair = require("goalpost.repair");
module.exports = {
    
    tick: function(){
        if (typeof Memory.goalEpoch== 'undefined'){
            Memory.goalpostEpoch = 3600;
        }
        if(typeof Memory.Epoch == 'undefined'){
            Memory.Epoch = 1;
        }
        Memory.goalpostEpoch = Math.ceil(3600);
        if(Game.time % Memory.goalpostEpoch == 0){
            Memory.Epoch+=1;
            goalpostRepair.set();
            
        }
    }
    
};
