/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('logic.room');
 * mod.thing == 'a thing'; // true
 */
var Midwife = require('run.Midwife');
var tower = require('role.tower');
module.exports = {
    run: function(){
            for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            
            // Only run colony management logic on your owned rooms.
            if (room.controller && room.controller.my) {
                // Run room-specific logic
                //if (Game.time % 300 == 0){
                    //Foreman.run(roomName);
                   
                //}
                tower.defendMyRoom(room.name);
                
                let currentRCL = room.controller.level;
    
                // Find all spawns in the current room
                const spawnsInRoom = room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_SPAWN }
                });
    
                if (spawnsInRoom.length > 0) {
                    const spawn = spawnsInRoom[0];
                    const energy = room.energyCapacityAvailable;
                    const discretionaryEnergy = room.energyAvailable;
                   
                    // Creep counting and metrics
                    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    
                    // --- SAFE MODE ACTIVATION ---
                    // If the Room Controller Level is less than 3 and there are hostile creeps,
                    // attempt to activate safe mode to protect the young colony.
                    if (currentRCL < 3 && hostiles.length > 0) {
                        const safeModeResult = room.controller.activateSafeMode();
                        spawn.createCustomCreep(discretionaryEnergy, 'gaurd');
                        if (safeModeResult === OK) {
                            console.log(`[${room.name}] SAFE MODE ACTIVATED due to hostiles presence at RCL ${currentRCL}.`);
                            Game.notify(`[${room.name}] SAFE MODE ACTIVATED due to hostiles presence at RCL ${currentRCL}.`, 15); // Sends an in-game notification
                        } else if (safeModeResult !== ERR_BUSY && safeModeResult !== ERR_TIRED) {
                            // Log if activation fails for reasons other than cooldown or already being active.
                            console.log(`[${room.name}] Failed to activate safe mode. Error code: ${safeModeResult}`);
                        }
                    }
                    // --- END SAFE MODE LOGIC ---
    
                    
                    Midwife.run(room, roomName, spawn, energy, discretionaryEnergy);
                    
                  
                }
            }
        }
    }
};