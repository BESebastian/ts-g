///<reference path='Item.ts'/>

class ItemFactory {

    public spawnHp():Item {
        var item = new Item('Hp Restore');
        item.setHp(1);
        return item;
    }

    public spawnHpUp():Item {
        var item = new Item('Hp+');
        item.setMaxHp(1);
        return item;
    }

    public spawnArmour():Item {
        var item = new Item('Armour+');
        item.setArmour(1);
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0x0000FF });
        item.setModel(THREE.SceneUtils.createMultiMaterialObject(geometry, [material]));
        return item;
    }

}
