///<reference path='Item.ts'/>

class ItemFactory {

    private itemPool;
    private collectablePool;

    constructor(itemPool, collectablePool) {
        this.itemPool = itemPool;
        this.collectablePool = collectablePool;
    }

    public itemPoolRandom():Item {
        var r = Math.floor(Math.random() * this.itemPool.length);
        var rand = this.itemPool[r];
        var item = new Item(rand.name || 'undefined')
            .setHp(rand.hp || 0)
            .setSpeed(rand.speed || 0)
            .setShotSpeed(rand.shotSpeed || 0)
            .setShotDelay(rand.shotDelay || 0)
            .setArmour(rand.armour || 0)
            .setMaxHp(rand.maxHp || 0)
            .setModel(rand.model);
        // TODO: disable removing items from pool until it works :v
        //this.itemPool.splice(r, 1);
        return item;
    }

    public collectablePoolRandom():Item {
        var r = Math.floor(Math.random() * this.collectablePool.length);
        var rand = this.collectablePool[r];
        var item = new Item(rand.name || 'undefined')
            .setHp(rand.hp || 0)
            .setArmour(rand.armour || 0)
            .setBombs(rand.bombs || 0)
            .setKeys(rand.keys || 0)
            .setModel(rand.model());
        return item;
    }

}
