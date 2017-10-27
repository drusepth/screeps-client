var optimals = require('service.optimization');

module.exports = {
  printRoleCounts: function () {
      var harvesters = this.screepsOfRole('harvester');
      var builders   = this.screepsOfRole('builder');
      var upgraders  = this.screepsOfRole('upgrader');
      var fortifiers = this.screepsOfRole('fortifier');
      var freeagents = this.screepsOfRole('free-agent');

      console.log('Tick stats');
      console.log('------------------------');
      console.log('Energy available: ' + Game.spawns['Ankov'].room.energyAvailable + ' / ' + Game.spawns['Ankov'].room.energyCapacityAvailable);
      console.log('Harvesters:  ' + harvesters + ' / ' + optimals.optimalHarvesterCount());
      console.log('Builders:    ' + builders   + ' / ' + optimals.optimalBuilderCount());
      console.log('Upgraders:   ' + upgraders  + ' / ' + optimals.optimalUpgraderCount());
      console.log('Fortifiers:  ' + fortifiers + ' / ' + optimals.optimalFortifierCount());
      console.log('Free agents: ' + freeagents + ' / ' + 0);
  },

  screepsOfRole: function(role) {
      return _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
  }

};
