/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.mining');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
        run: function(creep,mineral){
            

            // If a mineral is found and the creep's capacity is not full, harvest.
            if (mineral && creep.store.getFreeCapacity() > 0) {
                if (creep.harvest(mineral) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral, {visualizePathStyle: {stroke: '#ffaa00'}});
            }}
            // If the creep is full, find a lab and transfer the minerals.
            else if (creep.store.getFreeCapacity() === 0) {
            // Find a lab that has space for the specific mineral type.
            let lab = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_LAB && s.store.getFreeCapacity(mineral.mineralType) > 0
            });

                if (lab) {
                    // Transfer the mineral to the lab.
                    if (creep.transfer(lab, mineral.mineralType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(lab, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
};