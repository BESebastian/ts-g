///<reference path='Player.ts'/>

class CreatureFactory {

    public spawnPlayer():Player {
        var player = new Player();
        return player;
    }

}
