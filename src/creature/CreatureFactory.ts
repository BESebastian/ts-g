///<reference path='Player.ts'/>

class CreatureFactory {

    public spawnPlayer(vector):Player {
        var player = new Player();
        player.setPosition(vector);
        return player;
    }

}
