/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
   // Find the closest active energy source to harvest from.
        run: function(creep) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        
        // If the creep has a source and can't harvest it because it's out of range...
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            // ...then move towards that source.
            creep.moveTo(source);
        }
        }
};