// Filename: SMADS

/**
 * SMADS_Event - Simple Moving Average of Distance from Spawn (Event-Driven)
 * This module records a creep's distance from spawn only when explicitly told to,
 * allowing you to build a moving average based on specific events (e.g., when
 * a creep starts a work task).
 */

const historyLength = 15; // Stores the last 125 recorded distances.

module.exports = {
    /**
     * Records a single creep's current distance from the primary spawn to the room's history.
     * Call this from your creep logic when a specific event occurs.
     * @param {Creep} creep The creep instance to measure.
     */
    push: function(creep) {
        if (!creep || !creep.room) return; // Basic validation

        const roomName = creep.room.name;
        const spawns = creep.room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return; // No spawn to measure from

        const referencePos = spawns[0].pos;
        const currentDistance = creep.pos.getRangeTo(referencePos);

        // --- Memory Management ---
        if (!Memory.rooms) {Memory.rooms = {};}
        if (!Memory.rooms) { Memory.rooms = {}; }
        if (!Memory.rooms[roomName]) { Memory.rooms[roomName] = {}; }

        // CORRECTED: The name now matches in both the 'if' check and the initialization.
        if (!Memory.rooms[roomName].dfsHistory) { 
        Memory.rooms[roomName].dfsHistory = []; 
        }

        // Now, 'history' will correctly be assigned the array.
        const history = Memory.rooms[roomName].dfsHistory;
        
        // Add the new distance measurement to the history
        history.push(currentDistance);

        // Trim the history to the desired length
        if (history.length > historyLength) {
            for (i = 0; history.length-historyLength; i++){
            history.shift();    
            } 
        }
    },

    /**
     * Gets the current Simple Moving Average (SMA) of all logged distances for a room.
     * @param {string} roomName The name of the room to get data for.
     * @returns {number} The moving average of event-triggered distances.
     */
    get: function(roomName) {
        const history = _.get(Memory.rooms, [roomName, 'dfsHistory']);
        if (!history || history.length === 0) {
            return 0;
        }
        const sum = _.sum(history);
        return sum / history.length;
    }
};