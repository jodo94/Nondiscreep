/*
 * This module defines the behavior for a creep, specifically focusing on energy management.
 */

module.exports = {
    // The 'run' function contains the main logic for the creep.
    run: function(creep) {
        
        var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            // Filter to only look for energy.
            filter: (d) => {return (d.resourceType == RESOURCE_ENERGY && d.amount >50)}
        });
        
               // Find the closest active energy source to harvest from.
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        
        var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => ((s.structureType == STRUCTURE_STORAGE) 
                             && (s.store.getFreeCapacity(RESOURCE_ENERGY) < (1000000)))
                    
            });
        
        //&& ( creep.memory.role != 'harvester')
        
        // If there is dropped energy nearby...
        if (dropenergy && ( creep.memory.role != 'harvester')){
            // ...try to pick it up. If it's not in range...
            if (creep.pickup(dropenergy && ( creep.memory.role != 'harvester')) == ERR_NOT_IN_RANGE) {
                // ...move towards the dropped energy.
                creep.moveTo(dropenergy, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say('gimme');
            }
        }
/*
        else if (storage != null&& (creep.memory.role != 'harvester') && (source != null || source != 'undefined' || !source)) {
            // Try to withdraw energy from the storage. If it's not in range...
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // ...move to the storage.
                creep.moveTo(storage);
            
            }
        } 
*/
         
        else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            // ...then move towards that source.
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
        }
        
        // If the creep has a source and can't harvest it because it's out of range...
        else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            // ...then move towards that source.
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
        }
             // Find the closest storage structure that has less than 10,000,000 energy.
       
        
        // This block of code is for creeps that aren't harvesters and have no active sources to harvest from.

        // Find the closest dropped energy resource on the ground.
     
        

    }
};