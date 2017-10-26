module.exports = {
    displaySpawningCreep: function () {
        if (Game.spawns['Ankov'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Ankov'].spawning.name];
            Game.spawns['Ankov'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Ankov'].pos.x + 1,
                Game.spawns['Ankov'].pos.y,
                { align: 'left', opacity: 0.8 }
            );
        }
    }
};
