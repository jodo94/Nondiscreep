function getCreepRCL(creep) {
    if (creep && creep.room && creep.room.controller) {
        return creep.room.controller.level;
    }
    return 0;
}

module.exports = {
    /**
     * Calculates the next role for a creep based on the room's RCL.
     * @param {Creep} creep The creep object to manage.
     * @returns {string} The name of the next role.
     */
    tick: function(creep) {
        // Define the role priority arrays once in Memory if they don't exist.
        if (typeof Memory.StormingLaborCycle == "undefined") {
            Memory.StormingLaborCycle = ['harvester', 'repairer', 'builder'];
        }

        if (typeof Memory.NormingLaborCycle == "undefined") {
            Memory.NormingLaborCycle = ['harvester', 'builder', 'repairer'];
        }

        // Get the appropriate labor cycle based on the room's RCL.
        const currentRCL = getCreepRCL(creep);
        const laborCycle = (currentRCL >= 4) ?
            Memory.NormingLaborCycle :
            Memory.StormingLaborCycle;

        // Find the index of the creep's current role in the labor cycle.
        // The indexOf() method returns -1 if the role is not found.
        let currentIndex = laborCycle.indexOf(creep.memory.role);
        
        // If the current role isn't in the list, start from the beginning.
        if (currentIndex === -1) {
            currentIndex = -1; // -1 + 1 = 0, so the next role will be the first one
        }

        // Calculate the next index, wrapping around to the beginning of the array.
        let nextIndex = (currentIndex + 1) % laborCycle.length;
        
        // Return the name of the next role.
        return laborCycle[nextIndex];
    }
};