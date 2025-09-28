// SMAER - Simple Moving Average of Employment Ratio
// Calculates a moving average of the employment ratio over a set period.

// Constants
const historyLength = 150;

module.exports = {
    /**
     * Updates the employment metrics for a single room.
     * This should be called once per tick for each room you own.
     * @param {string} roomName The name of the room to analyze.
     * @param {number} sizeOfLaborForce The total number of non-combat creeps.
     */
    update: function(roomName, EmploymentRatio) {
        // IMPORTANT: Ensure the Memory.rooms object exists before using it.
        if (!Memory.rooms) {
            Memory.rooms = {};
        }

        // Ensure the memory structure exists for the specific room
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        if (!Memory.rooms[roomName].erHistory) {
            Memory.rooms[roomName].erHistory = [];
        }
        
       
        // --- THE FIX ---
        // A creep is "employed" if it's a non-combat creep and has at least 5 energy.
        // This is a more accurate representation of your dynamic creep roles.
     

        // Handle the case where there are no creeps to avoid division by zero

        let currentER = EmploymentRatio;
        
     
        // Push the new ER to the history array and trim old data
        const history = Memory.rooms[roomName].erHistory;
        

        // Keep the history array at a manageable size
        if (history.length > historyLength) {
            
            for (i = 0; i < (history.length-historyLength); i++){
            Memory.rooms[roomName].erHistory.shift();
            }
            
        }
        else{
            Memory.rooms[roomName].erHistory.push(currentER);
        }
    },

    /**
     * Gets the current Simple Moving Average (SMA) for a room.
     * @param {string} roomName The name of the room to get data for.
     * @returns {number} The SMA for the room's Employment Ratio.
     */
    get: function(roomName) {
        // Return 0 if the memory for this room or history is not yet initialized
        if (!Memory.rooms || !Memory.rooms[roomName] || !Memory.rooms[roomName].erHistory || Memory.rooms[roomName].erHistory.length === 0) {
            return 0; 
        }
        
        const history = Memory.rooms[roomName].erHistory;
        // The _.sum function is now correctly used here.
        const sum = _.sum(history);
        
        // Return the average
        return sum / history.length;
    }
};