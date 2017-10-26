var constants = require('constants');

var roleUpgrader = {
    run: function(creep) {
        this.creep = creep;
        this.creep.say('upgrader');

	    if (this.currentlyUpgrading() && this.outOfEnergy()) {
            this.orderToCollectEnergy();
	    }

	    if (!this.currentlyUpgrading() && this.atEnergyCapacity()) {
	        this.orderToUpgrade();
	    }

	    if (this.currentlyUpgrading()) {
	        if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller, { visualizePathStyle: { stroke: '#ff0000' } });
            }
	    } else {
	        var stockedStockpiles = this.energyStockpiles();
	        if (stockedStockpiles.length > 0 && Game.spawns['Ankov'].room.energyAvailable > 300) {
	            // TODO: assign to closest stockpile
	            var assignedStockpile = stockedStockpiles[0];
	            if (this.creep.withdraw(assignedStockpile, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                this.creep.moveTo(assignedStockpile, { visualizePathStyle: { stroke: '#ffaa00' } });
	            }
	        } else {
	            var sources = this.creep.room.find(FIND_SOURCES);
                if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
	        }
	    }
	},

	energySourceByDistance: function () {
    	return this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
	},

	currentlyUpgrading: function () {
	    return this.creep.memory.building;
	},

	orderToCollectEnergy: function () {
	    this.creep.memory.building = false;
        this.creep.say('🔄 harvest');
	},

	orderToUpgrade: function () {
        this.creep.memory.building = true;
        this.creep.say('🚧 build');
	},

	outOfEnergy: function () {
	    return this.creep.carry.energy == 0;
	},

	atEnergyCapacity: function () {
	    return this.creep.carry.energy == this.creep.carryCapacity;
	},

	energyStockpiles: function () {
	    return this.creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN
                ) && (
                    structure.energy >= this.creep.pos.findPathTo(structure).length
                );
            }
        });
	},
};

module.exports = roleUpgrader;
