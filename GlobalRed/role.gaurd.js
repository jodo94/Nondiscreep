/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.gaurd');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
 run: function(creep) {
        // It's good practice to keep other modules like warpath if they set memory or states.

        // --- Define the target room for the attack ---
       

        // --- Phase 2: Attack Logic (Executes only in the target room) ---

        // 1. Prioritize attacking hostile creeps.
        const enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if (enemy) {
            creep.say('Engage!');
            // Engage the hostile creep.
            if (_.some(creep.body, {type: RANGED_ATTACK})) {
                if (creep.rangedAttack(enemy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy, { visualizePathStyle: { stroke: '#00ff00' } });
                }
            } else if (_.some(creep.body, {type: ATTACK})) {
                if (creep.attack(enemy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
            return; // Focus on the current enemy.
        }
    
    }
};