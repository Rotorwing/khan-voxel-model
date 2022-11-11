class Voxel{
    
    constructor(id){
        this.id = id;
        this.materialId;

        this.unscaledColor = {r:255, g:255, g:255, a:255};

        this.mesh = new BABYLON.MeshBuilder.CreateBox("voxel", {size: 1}, scene);
        this.mesh.metadata = id;
        
        this.mesh.material = new BABYLON.StandardMaterial("voxelmat"+id, scene);

        this.hoverColor = new BABYLON.Color4(0.74, 0.74, 0.74, 1.0);
        this.selectionColor = new BABYLON.Color4(0.74, 0.6, 0.25, 1.0);
        this.hoverSelectionColor = new BABYLON.Color4(0.74, 0.65, 0.5, 1.0);
        //this.mesh.material.wireframe = true;

        this.offset = offsetVector;

        this.mesh.position = this.offset;

        this.selected = false;
        this.hovering = false;

        this.edgesSize = 0.501;

        this.vertexes = [
            new BABYLON.Vector3(this.edgesSize, this.edgesSize, this.edgesSize),
            new BABYLON.Vector3(this.edgesSize, -this.edgesSize, this.edgesSize),
            new BABYLON.Vector3(-this.edgesSize, -this.edgesSize, this.edgesSize),
            new BABYLON.Vector3(-this.edgesSize, this.edgesSize, this.edgesSize),

            new BABYLON.Vector3(this.edgesSize, this.edgesSize, -this.edgesSize),
            new BABYLON.Vector3(this.edgesSize, -this.edgesSize, -this.edgesSize),
            new BABYLON.Vector3(-this.edgesSize, -this.edgesSize, -this.edgesSize),
            new BABYLON.Vector3(-this.edgesSize, this.edgesSize, -this.edgesSize),
        ]
        this.edges = [
            [this.vertexes[0], this.vertexes[1], this.vertexes[2], this.vertexes[3], this.vertexes[0]],
            [this.vertexes[4], this.vertexes[5], this.vertexes[6], this.vertexes[7], this.vertexes[4]],
            [this.vertexes[0], this.vertexes[4]],
            [this.vertexes[1], this.vertexes[5]],
            [this.vertexes[2], this.vertexes[6]],
            [this.vertexes[3], this.vertexes[7]],
        ]

        this.edges = new BABYLON.CreateLineSystem("edges", {lines: this.edges, updatable: true}, scene); //new BABYLON.MeshBuilder.CreateBox("ghost", {size: 1.02}, scene); ////
        //new BABYLON.LinesMesh().color

        //this.edges.enableEdgesRendering();
        //this.edges.edgesWidth = 1;
        this.edges.visibility = false;
        //this.mesh.visibility = false;

        
        this.edges.position = this.mesh.position;

    }

    /**
     * 
     * @param {BABYLON.Color4} color 
     */
    setColor(color){
        this.mesh.material.diffuseColor = color;
        this.mesh.material.alpha = color.a;
        
        this.unscaledColor.r = color.r*255;
        this.unscaledColor.g = color.g*255;
        this.unscaledColor.b = color.b*255;
        this.unscaledColor.a = color.a*255;
    }
    getColor(){
        return new BABYLON.Color4(this.mesh.material.diffuseColor.r, this.mesh.material.diffuseColor.g,
                                  this.mesh.material.diffuseColor.b, this.mesh.material.alpha);
    }
    setColorUnscaled(color){
        this.unscaledColor.r = color.r;
        this.unscaledColor.g = color.g;
        this.unscaledColor.b = color.b;
        this.unscaledColor.a = color.a;

        this.mesh.material.diffuseColor = new BABYLON.Color3(color.r/255, color.g/255, color.b/255);
        this.mesh.material.alpha = color.a/255;
    }
    getColorUnscaled(){
        return this.unscaledColor;
    }

    /**
     * 
     * @param {BABYLON.Vector3} position 
     */
    setPosition(position){
        this.mesh.position = position.add(this.offset);
        this.edges.position = this.mesh.position;
    }
    getPosition(){
        return this.mesh.position;
    }

    setHovering(){
        this.hovering = true;
        this.updateBorderColor();
    }
    setNotHovering(){
        this.hovering = false;
        this.updateBorderColor();
    }
    setSelected(){
        this.selected = true;
        this.updateBorderColor();
    }
    setNotSelected(){
        this.selected = false;
        this.updateBorderColor();
    }
    setNoState(){
        this.selected = false;
        this.hovering = true;
        this.updateBorderColor();
    }

    updateBorderColor(){
        if (this.hovering || this.selected){
            this.edges.visibility = true;
        }else{
            this.edges.visibility = false;
            return;
        }
        if(this.selected && this.hovering){
            this.edges.color = this.hoverSelectionColor;
        }else if(this.selected){
            this.edges.color = this.selectionColor;
        }else if(this.hovering){
            this.edges.color = this.hoverColor;
        }
    }

    delete(){
        scene.removeMesh(this.mesh);
        scene.removeMesh(this.edges);
    }
}