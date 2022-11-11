class BoxSelect{
    /**
     * 
     * @param {BABYLON.Camera} camera 
     */
    constructor(camera){
        this.camera = camera;

        this.point1;
        this.point2;

        this.planes = [];

        this.rectangle = new BABYLON.MeshBuilder.CreatePlane("BoxSelectOverlay", {size:2, updatable:true}, scene);
        this.rectangle.material = new BABYLON.StandardMaterial("BoxSelectMat");
        this.rectangle.material.backFaceCulling = false;
        this.rectangle.material.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        this.rectangle.material.alpha = 0.3;
        // this.rectangle.enableEdgesRendering();
        // this.rectangle.edgesWidth = 1;
        // this.rectangle.edgesColor = new BABYLON.Color4(0.1, 0.1, 0.1, 0.75);
        this.rectangle.visibility = false;

        console.log(this.rectangle.getVerticesData(BABYLON.VertexBuffer.PositionKind));
    }

    getRays(){
        let rays = [];
        rays.push(scene.createPickingRay(this.point1.x, this.point1.y));
        rays.push(scene.createPickingRay(this.point2.x, this.point1.y));
        rays.push(scene.createPickingRay(this.point1.x, this.point2.y));
        rays.push(scene.createPickingRay(this.point2.x, this.point2.y));
        return rays;
    }

    getPoints3D(){
        let _rays = this.getRays();
        let rays = [_rays[0], _rays[1], _rays[3], _rays[2]]
        let points = [];
        for(let i = 0; i < 4; i++){
            points.push(rays[i].origin.add(rays[i].direction));
        }
        return points;
    }

    mouseDown(){
        this.point1 = new BABYLON.Vector2(scene.pointerX, scene.pointerY);
    }

    mouseUp(){
        this.point2 = new BABYLON.Vector2(scene.pointerX, scene.pointerY);
        this.rectangle.visibility = false;
    }

    mouseMove(){
        if(this.point1){
            this.rectangle.visibility = true;
            this.point2 = new BABYLON.Vector2(scene.pointerX, scene.pointerY);
            let points = this.getPoints3D().reverse();
            let coords = [];

            for (const point of points) {
                coords.push(point.x);
                coords.push(point.y);
                coords.push(point.z);
            }

            this.rectangle.setVerticesData(BABYLON.VertexBuffer.PositionKind, coords, true);
            
        }
    }

    createFrustum(){
        let rays = this.getRays();
 
        let n = [];
        n.push(BABYLON.Vector3.Cross(rays[0].direction, rays[1].direction));
        n.push(BABYLON.Vector3.Cross(rays[1].direction, rays[3].direction));
        n.push(BABYLON.Vector3.Cross(rays[2].direction, rays[0].direction));
        n.push(BABYLON.Vector3.Cross(rays[3].direction, rays[2].direction));

        

        this.planes = [];
        for(let i = 0; i < 4; i++){
            console.log(n[i]);
            this.planes.push(new BABYLON.Plane(n[i].x, n[i].y, n[i].z, 
            - rays[i].origin.x*n[i].x - rays[i].origin.y*n[i].y- rays[i].origin.z*n[i].z));
        }
    }

    isInFrustum(vertex){
        var contains = true;
        for(let j = 0; j < 4; j++){
            //console.log(vertex, this.planes[j].signedDistanceTo(vertex));
            if (this.planes[j].signedDistanceTo(vertex) > 0){
                contains = false;
                break;
            }
        }
        return contains;
    }

    revertCameraFrustum(){
        this.camera.viewport = new BABYLON.Viewport(0, 0, 1, 1);
        this.camera.update();
    }

    reset(){
        this.point1 = null;
        this.point2 = null;
    }

}