/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claim');
 * mod.thing == 'a thing'; // true
 */
var warpath = require('task.warpath');

module.exports = {
     run: function(creep) {
        const controller = creep.room.controller;
        const finalDestination = new RoomPosition(25, 25, 'E43S56');
        
        //creep.move(RIGHT);
        
        if (creep.room.name !== finalDestination.roomName) {
            warpath.run(creep);
        }
    
       
            
             // 3. If no creeps or priority structures, attack t he room controller.
        
        if (controller && !controller.my) { // Ensure it's an enemy controller.
            if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffff00' } });
            }
        }
       
}};