///<reference path='Item.ts'/>

class ItemFactory {

    public spawnHpUp():Item {
        var item = new Item('Hp+');
        item.setMaxHp(1);
        return item;
    }

}
