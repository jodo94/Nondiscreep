/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.harvesting');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
     run: function(creep) {         
            // find closest source
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}});
            
            var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE &&
                           structure.store.getFreeCapacity(RESOURCE_ENERGY) < 10000000;
                }
            });
            
            if (dropenergy) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy)
                }
            }
            
            else {
                // Withdraw energy if in range, otherwise move to the container
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }

     }
};