class ItemPools {

    public getItemPool() {
        return [
            {
                name: 'Dinner',
                maxHp: 1,
                hp: 1
            },
            {
                name: 'Breakfast',
                maxHp: 1,
                hp: 1
            },
            {
                name: 'Lard',
                maxHp: 2,
                hp: 2,
                speed: -0.1
            },
            {
                name: 'Shot Speed',
                shotSpeed: 0.1
            },
            {
                name: 'Shot Delay',
                shotDelay: -0.2
            }
        ];
    }

    public getCollectablePool() {
        return [
            {
                name: 'Hp',
                hp: 1,
                model: function() {
                    var geometry = new THREE.CubeGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
                    var model = new THREE.Mesh(geometry, material);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    return model;
                }
            },
            {
                name: 'Armour',
                armour: 1,
                model: function() {
                    var geometry = new THREE.CubeGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ color: 0x0000FF });
                    var model = new THREE.Mesh(geometry, material);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    return model;
                }
            }
        ];
    }
}
