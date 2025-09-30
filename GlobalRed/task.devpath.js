/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.devpath');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
   run: function(creep) {
        // The final destination you want the creep to reach.
        // It will path through all necessary rooms on its own.
        const finalDestination = new RoomPosition(25, 25, Memory.buildRoomName);
        creep.move(BOTTOM);
        //creep.move(RIGHT);
        
        if (creep.room.name !== finalDestination.roomName) {
            // Tell the creep to move to the final destination.
            creep.moveTo(finalDestination, { visualizePathStyle: { stroke: '#ffffff' } });
            creep.say('Moving!');
        } else {
            // The creep has arrived.
            
            return;
        }
    }
};