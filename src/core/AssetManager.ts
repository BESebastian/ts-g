class AssetManager {

    private images;

    constructor() {
        this.images = [];
    }

    public loadImage(name, path) {
        var img = new Image();
        img.src = path;
        this.images[name] = img;
    }

    public getImage(name) {
        return this.images[name];
    }

}
