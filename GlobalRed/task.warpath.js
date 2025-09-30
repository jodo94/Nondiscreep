// Add this to your creep's memory when it's spawned
// Example: creep.memory.path = ['E43S55', 'E43S56'];

module.exports = {
   run: function(creep) {
        // The final destination you want the creep to reach.
        // It will path through all necessary rooms on its own.
        const finalDestination = new RoomPosition(25, 25, 'E43S55');
        
        creep.move(RIGHT);
        
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