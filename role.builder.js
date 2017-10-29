var constants     = require('constants');
var poiByDistance = require('shared.poi_by_distance');

var roleBuilder = {
  run: function(creep) {
    this.creep = creep;
    this.creep.say('builder');

    if (this.currentlyBuilding() && this.outOfEnergy()) {
      this.orderToCollectEnergy();
    }

    if (!this.currentlyBuilding() && this.atEnergyCapacity()) {
      this.orderToBuild();
    }

    if (this.currentlyBuilding()) {
      var constructionSites = this.unfinishedConstructionSites();
      if (constructionSites.length > 0) {
        if (this.creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(constructionSites[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        // No construction to do!
        this.creep.memory.role = 'free-agent';
      }
    } else {
      var stockedStockpiles = this.energyStockpiles();
      if (stockedStockpiles.length > 0) {
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

  unfinishedConstructionSites: function () {
    return poiByDistance.find(this.creep, FIND_CONSTRUCTION_SITES);
  },

  currentlyBuilding: function () {
    return this.creep.memory.building;
  },

  orderToCollectEnergy: function () {
    this.creep.memory.building = false;
    this.creep.say('🔄 harvest');
  },

  orderToBuild: function () {
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

module.exports = roleBuilder;
