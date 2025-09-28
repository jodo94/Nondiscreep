
var taskHarvesting = require('task.harvesting');
var taskHauling = require('task.hauling');
var Dice = require('roll.dice');
var LaborCycle = require('tick.laborCycle');
var SMADS = require('SMADS');
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

       
        // if creep is trying to repair something but has no energy left
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working === true && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = false;
            SMADS.push(creep);
            creep.memory.working = false;
            creep.say('UWU');
        }
        else if (creep.memory.working === false && (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0))  {
            creep.memory.working = true;
            creep.memory.dsToken = true;
            creep.say('💪');
        }
        
                
        
        
        var EmptyBirthCanal = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (((s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION)
                             && (s.energy < s.energyCapacity)))
                            
            });

        // --- Step 3: Execute the creep's tasks based on its state ---
        // If the creep has energy to deliver
        if (creep.memory.working === true || !source) {
            if(creep.memory.dsToken == true && (creep.getFreeCapacity>10)){
                SMADS.push(creep);
                creep.memory.dsToken = false;
                creep.say('UWU');
            }
            var towers = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => ((s.structureType == STRUCTURE_TOWER)
                    && (s.energy <= ((7/10)*s.energyCapacity)))
            });
            
                   // find closest structure with less than max hits
            // Exclude walls because they have way too many max hits and would keep
            // our repairers busy forever. We have to find a solution for that later.
            var damagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
               filter: (s) =>  ((s.hits < s.hitsMax && s.structureType !=STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
               || ((s.hits < 10000) && s.structureType == STRUCTURE_WALL)
               || (s.hits < (Memory.goalpostRepair/30) && s.structureType == STRUCTURE_RAMPART))
               
            });
            
            if (EmptyBirthCanal){
                       
                if (creep.transfer(EmptyBirthCanal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(EmptyBirthCanal);
                }
            }
            // if we found one
            else if (towers != undefined) {
                creep.memory.employed = true;
                // try to transfer energy, if it is not in range
                if (creep.transfer(towers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(towers);
                }
            }
     

            // if we find one
            else if (damagedStructure) {
            
                // try to repair it, if it is out of range
                if (creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(damagedStructure);
                    
                }
            }
            

            // if we can't fine one

            else {
                          
                const nextRole = LaborCycle.tick(creep);
                creep.memory.role = nextRole;
                creep.say(`${nextRole}!`);
            }

        }
        // if creep is supposed to harvest energy from source
       //console.log(typeof source);
        else{
                taskHarvesting.run(creep);
        }

    
}}; 
