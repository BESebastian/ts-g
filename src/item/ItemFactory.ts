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
        item.setHp(1);
        return item;
    }

    public spawnArmour():Item {
        var item = new Item('Armour');
        item.setArmour(1);
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0x0000FF });
        var model = new THREE.Mesh(geometry, material);
        model.castShadow = true;
        model.receiveShadow = true;
        item.setModel(model);

        return item;
    }

    public spawnShotSpeed():Item {
        var item = new Item('Shot Speed Shit');
        item.setShotSpeed(1);
        return item;
    }

    public spawnShotDelay():Item {
        var item = new Item('Reduce Shot Delay');
        item.setShotDelay(-0.2);
        return item;
    }

}
