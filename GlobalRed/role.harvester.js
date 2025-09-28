// Import necessary modules for the creep's functions
var roleRepairer = require('role.repairer');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var taskHarvesting = require('task.harvesting');
var goalpostStorage = require('goalpost.storage'); // This module is currently unused, but kept.
var dice = require('roll.dice'); // This module is currently unused, but kept.
var taskMining = require('task.mining'); // This module is currently unused, but kept.
var LaborCycle = require('tick.laborCycle');
var SMADS = require('SMADS');

// This module contains the logic for a harvester creep.
// Harvesters gather energy and distribute it to various structures.
module.exports = {
    /**
     * @param {Creep} creep The creep object to run the logic for.
     */
    run: function(creep) {
        goalpostStorage.set();
        // --- Step 1: Find all necessary targets ---
        // Find the closest active energy source
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        // Find the closest Spawn or Extension that needs energy
        let lowEnergyStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (
                (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && 
                s.energy < s.energyCapacity
            )
        });
        
        let container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (
                (s.structureType === STRUCTURE_CONTAINER && c.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            )
        });
        // Find the closest storage (or container) that has free capacity
        let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (
                (s.structureType === STRUCTURE_STORAGE && s.store.getFreeCapacity(RESOURCE_ENERGY) > (1000000-(50000+((Memory.Epoch % 20)*50000))))
            )
        });

        // Find the closest Tower that needs energy (less than 40% full)
        let lowEnergyTower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy <= (s.energyCapacity * 0.6)
        });
        
        // NOTE: 'EmptyBirthCanal' is redundant since 'lowEnergyStructure' finds the same targets.
        // It is kept for consistency with your original code but is unused below.
        /*
        var EmptyBirthCanal = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (
                ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && 
                (s.energy < s.energyCapacity))
            )
        });
        */
        
        // --- Step 2: Manage the creep's working state ---
        // Switch to harvesting mode if the creep's energy store is empty
        if (creep.memory.working === true && creep.store.getUsedCapacity() === 0) {
            creep.memory.working = false;
            creep.memory.dsToken = true;
            creep.say('😩');
            
        }
        // Switch to working mode if the creep's energy store is full
        else if (((creep.memory.working === false) && (creep.store.getFreeCapacity() === 0))) {
            creep.memory.working = true;
            SMADS.push(creep);
            creep.memory.dsToken = false;
            creep.say('UWU');
        }
        
        else if (!source){
            creep.memory.working = true;
        }

        // --- Step 3: Execute the creep's tasks based on its state ---
        // If the creep has energy to deliver
        if (creep.memory.working === true) {
            
            /*
            if(creep.memory.dsToken == true && (creep.store.getCapacity() - creep.store.getUsedCapacity('energy')) > 0){
                SMADS.push(creep);
                creep.memory.dsToken = false;
                creep.say('UWU');
            }
            */
            // 1. Prioritize filling spawns and extensions
            // FIX APPLIED: Changed `!= 'underfined'` to simply checking if the target exists (`if (lowEnergyStructure)`).
            if (lowEnergyStructure) {
                if (creep.transfer(lowEnergyStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(lowEnergyStructure);
                }
            }
            
            // 2. Next, prioritize filling low-energy towers
            else if (lowEnergyTower) {
                if (creep.transfer(lowEnergyTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(lowEnergyTower);
                }
            }
            
            else if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            else if (storage) {
                if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
            
            // 4. If all structures are full, change the creep's role
            else {
                const nextRole = LaborCycle.tick(creep);
                creep.memory.role = nextRole;
                creep.say(`${nextRole}!`);
            }
        }
        
        // If the creep needs to harvest energy
        else {
            // Check for an active energy source
            if (source) {
                // Run the harvesting task
                taskHarvesting.run(creep);
            }
            // If no active sources are found, the creep's role logic is currently empty here.
            // You might add an alternative action if no sources are active.
        }
    }
};