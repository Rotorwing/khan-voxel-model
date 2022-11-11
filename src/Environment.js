class Environment{
    constructor(){
        const originX = this.drawLine(new BABYLON.Vector3.Zero(), new BABYLON.Vector3(1, 0, 0), new BABYLON.Color4(1.0, 0.0, 0.0, 1.0));
        const originY = this.drawLine(new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 1, 0), new BABYLON.Color4(0.0, 1.0, 0.0, 1.0));
        const originZ = this.drawLine(new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, 1), new BABYLON.Color4(0.0, 0.0, 1.0, 1.0));

        const gridSize = 5;
        for(var x = -gridSize; x <= gridSize; x++){
            const alpha = (1-Math.abs(x/gridSize))*0.75;
            const start = x==0 ? 1 : 0;
            this.drawLine(new BABYLON.Vector3(x, 0, start), new BABYLON.Vector3(x, 0, gridSize),
                          new BABYLON.Color4(0.5, 0.5, 0.5, alpha), new BABYLON.Color4(0.5, 0.5, 0.5, 0.0));
            this.drawLine(new BABYLON.Vector3(x, 0, 0), new BABYLON.Vector3(x, 0, -gridSize),
                          new BABYLON.Color4(0.5, 0.5, 0.5, alpha), new BABYLON.Color4(0.5, 0.5, 0.5, 0.0));

            this.drawLine(new BABYLON.Vector3(start, 0, x), new BABYLON.Vector3(gridSize, 0, x),
                          new BABYLON.Color4(0.5, 0.5, 0.5, alpha), new BABYLON.Color4(0.5, 0.5, 0.5, 0.0));
            this.drawLine(new BABYLON.Vector3(0, 0, x), new BABYLON.Vector3(-gridSize, 0, x),
                          new BABYLON.Color4(0.5, 0.5, 0.5, alpha), new BABYLON.Color4(0.5, 0.5, 0.5, 0.0));
        }
    }

    drawLine(start, end, color){
        const points = [
            start,
            end
        ]
        return new BABYLON.MeshBuilder.CreateLines("xAxis", {points: points, updatable: false, colors:[color, color]}, scene);
    }

    drawLine(start, end, startColor, endColor){
        const points = [
            start,
            end
        ]
        return new BABYLON.MeshBuilder.CreateLines("xAxis", {points: points, updatable: false, colors:[startColor, endColor || startColor]}, scene);
    }
}