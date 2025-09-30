/*
 * Module code for the 'decoy' creep role.
 * A Decoy creep is designed to travel to a target room and then actively kite
 * hostile creeps to draw fire and protect other, more vulnerable units.
 * All visual and verbal feedback (creep.say and visualizePathStyle) has been removed.
 */

module.exports = {
    /**
     * The main run function for the decoy role.
     * @param {Creep} creep
     */
    run: function(creep) {
        
        // --- Configuration: Manually set the target room here ---
        // !!! IMPORTANT: CHANGE THIS ROOM NAME TO YOUR DESIRED TARGET !!!
        const targetRoomName = Memory.targetRoomName; // <-- REPLACE 'E50N50' with the actual room you want to send the decoy to.
        const DANGER_RANGE = 5; // Threshold for immediate escape

        // 1. --- Hostile Intercept & Kiting (Priority 1: Always check for hostiles first) ---
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (hostile) {
            const hostileRange = creep.pos.getRangeTo(hostile);

            // --- A) IMMEDIATE DANGER ESCAPE (Highest Priority) ---
            if (hostileRange <= DANGER_RANGE) {
                delete creep.memory.kitingTarget; // Cancel long-distance target to focus on immediate safety

                // Calculate position 3 tiles directly away from the hostile
                const dx = creep.pos.x - hostile.pos.x;
                const dy = creep.pos.y - hostile.pos.y;
                
                // Calculate escape position 3 tiles away (clamped to 1-48 to stay off the edges)
                const escapeX = Math.min(48, Math.max(1, creep.pos.x + Math.sign(dx) * 3));
                const escapeY = Math.min(48, Math.max(1, creep.pos.y + Math.sign(dy) * 3));
                
                const escapePos = new RoomPosition(escapeX, escapeY, creep.room.name);

                creep.moveTo(escapePos, { 
                    reusePath: 0 // NO path reuse for immediate, single-step reaction
                });
                return; // Stop execution after immediate escape
            }

            // --- B) LONG-DISTANCE KITING (If safely outside DANGER_RANGE) ---
            const kitingTarget = creep.memory.kitingTarget;

            // Check for edge trap while kiting long distance
            if (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) {
                // Clear target and move immediately to the center to prevent room exit
                delete creep.memory.kitingTarget;
                creep.moveTo(new RoomPosition(25, 25, creep.room.name), { reusePath: 5 });
                return;
            }

            // If no long-term kiting target is set, or if we've reached the current target (within 5 tiles), find a new one
            if (!kitingTarget || creep.pos.inRangeTo(new RoomPosition(kitingTarget.x, kitingTarget.y, creep.room.name), 5)) {
                
                const hostileX = hostile.pos.x;
                const hostileY = hostile.pos.y;
                let targetX, targetY;
                
                // Logic to target the opposite quadrant for a proper chase
                if (hostileX < 25 && hostileY < 25) {
                    targetX = 40; targetY = 40;
                } else if (hostileX >= 25 && hostileY < 25) {
                    targetX = 10; targetY = 40;
                } else if (hostileX < 25 && hostileY >= 25) {
                    targetX = 40; targetY = 10;
                } else {
                    targetX = 10; targetY = 10;
                }
                
                // Add randomness (up to 5 tiles variance) and clamp to safe boundaries (5-45)
                targetX = Math.min(45, Math.max(5, targetX + Math.floor(Math.random() * 11) - 5));
                targetY = Math.min(45, Math.max(5, targetY + Math.floor(Math.random() * 11) - 5));

                const newTargetPos = new RoomPosition(targetX, targetY, creep.room.name);
                
                // Store the new target
                creep.memory.kitingTarget = { x: newTargetPos.x, y: newTargetPos.y };
            }
            
            // Move towards the stored kiting target
            const currentTarget = creep.memory.kitingTarget;
            const destination = new RoomPosition(currentTarget.x, currentTarget.y, creep.room.name);
            
            creep.moveTo(destination, { 
                reusePath: 15 // High reusePath for smoother long-distance movement
            });
            return; // Stop execution after kiting
        } else {
             // If hostile is lost, clear the kiting target so it can resume travel
            delete creep.memory.kitingTarget;
        }

        // 2. --- Travel to Target Room (Priority 2: Only runs if NO hostile is present) ---
        if (creep.room.name !== targetRoomName) {
            const destination = new RoomPosition(25, 25, targetRoomName);
            creep.moveTo(destination, {});
            return;
        }
        
        // 3. --- Patrol / Wait in Target Room (Priority 3: Only runs if in target room and no hostile) ---
        const center = new RoomPosition(25, 25, creep.room.name);
        
        // Only move if not already close to the center
        if (!creep.pos.inRangeTo(center, 3)) {
            creep.moveTo(center, {});
        }
    }
};
