/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('goalpost.repair');
 * mod.thing == 'a thing'; // true
 
 CURRENTLY CALLED IN TICK.EPOCH, since it only needs to be updated every EPOCH.
 */

module.exports = {
    set: function(){
            if(Memory.goalpostRepair == 'undefined'){
                Memory.goalpostRepair = 0;
            }
            if (Memory.goalpostRepair>=30000000){
                Memory.goalpostRepair =30000000;
            }
            else{

               Memory.goalpostRepair =30000000;
            }
    }
};