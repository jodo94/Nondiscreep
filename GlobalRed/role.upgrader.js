var Dice = require('roll.dice');
var taskHarvesting = require('task.harvesting');
var SMADS = require('SMADS');
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        
        const targetRoom =  creep.room.name;
        // A simple way to get the resource type the creep is carrying.
        // This assumes the creep carries only one resource type at a time.
        let resourceToTransfer = Object.keys(creep.store).find(resource => creep.store[resource] > 0);

        
        
        
        
        
        if (creep.room.name !== targetRoom) {
                const exitDirection =  creep.room.findExitTo(targetRoom);
                const exitRoom = creep.pos.findClosestByPath(exitDirection);
                creep.moveTo(exitRoom);
            }
        
        else {
        if (creep.memory.working === true && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = false;
            SMADS.push(creep);
            creep.memory.working = false;
            creep.say('UWU');
        }
        else if (creep.memory.working === false && (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0))  {
            creep.memory.working = true;
            creep.memory.dsToken = true;
            creep.say('💪');
        }
        

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // try to upgrade the controller
           if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        // if creep is supposed to harvest energy from source

            else{
                taskHarvesting.run(creep);
            }
            }}
};