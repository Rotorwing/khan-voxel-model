/**
 * @param {import("babylonjs")}
 */
const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const scene = new BABYLON.Scene(engine);

const voxels = [];
const materials = {};
const selected = [];
var hovering = -1;
var cId = 0;

var pickingRay;

var usingTool = "";

const tools = {
    boxSelect: new BoxSelect(null),
    saver: new Saver(),
    loader: new Loader(),
    upscaler: new Upscaler(),
}

const clickData = {
    start: {x:0, y:0},
    end: {x:0, y:0}
}
const clickTolerance = 1;

var currentColor = {r:255, g:255, b:255, a:255};

const offsetVector = new BABYLON.Vector3(0.5, 0.5, 0.5);

const createScene = function () {
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/3, Math.PI/3, 10, new BABYLON.Vector3.Zero(), scene);
    camera.useNaturalPinchZoom = true;
    //camera.
    //scene.pointer

    camera.attachControl(canvas, true);

    tools.boxSelect.camera = camera;

    const light = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(5.0, 8.0, 3.0), scene);
    scene.environmentIntensity = 1;
    //const shadows = new BABYLON.DirectionalLight("shadows", new BABYLON.Vector3(5.0, 5.0, 4.0), scene);
    //shadows.intensity = 0.5;

    const environment = new Environment();

    addVoxel(new BABYLON.Vector3.Zero(), currentColor);
    //voxels[0].setPosition(new BABYLON.Vector3(1, 2, 3));

    const ghost = new BABYLON.MeshBuilder.CreateBox("ghost", {size: 1}, scene);
    ghost.material = new BABYLON.Material();
    ghost.enableEdgesRendering();
    ghost.edgesColor = new BABYLON.Color4(0.1, 0.1, 0.1, 0.9);
    ghost.edgesWidth = 1;

    scene.onPointerMove = (e) =>{
        castRay(e);
        if(usingTool == "boxSelect"){
            tools.boxSelect.mouseMove();
        }
    }
    
    function castRay(e){
        var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera, false);	

        var hit = scene.pickWithRay(ray, (e) => {
            return e.name == "voxel";
        });

        hovering = -1;
        if(hit.pickedMesh){
            for(var i = 0; i < voxels.length; i++){
                voxel = voxels[i];
                if(voxel.id == hit.pickedMesh.metadata){
                    if(e.shiftKey){
                        var indices = hit.pickedMesh.getIndices();
                        const point = hit.pickedMesh.getFacetPosition(hit.faceId);//.getFacetLocalPositions(hit.faceId);
                        //console.log(point);
                        const localX = point.x-hit.pickedMesh.position.x;
                        const localY = point.y-hit.pickedMesh.position.y;
                        const localZ = point.z-hit.pickedMesh.position.z;
                        
                        const offsetX = localX >= 0.5 ? 1 : localX <= -0.5 ? -1 : 0;
                        const offsetY = localY >= 0.5 ? 1 : localY <= -0.5 ? -1 : 0;
                        const offsetZ = localZ >= 0.5 ? 1 : localZ <= -0.5 ? -1 : 0;

                        ghost.position = hit.pickedMesh.position.add(new BABYLON.Vector3(offsetX, offsetY, offsetZ));
                        ghost.visibility = true;
                    }else{
                        ghost.visibility = false;
                    }
                    hovering = i;
                    
                }
            }
        }else{
            ghost.visibility = false;
        }
        updateSelections();
    }   
    //scene.onPointerPick
    document.onpointerdown = (e) => {

        clickData.start.x = e.clientX;
        clickData.start.y = e.clientY;

    
        if(usingTool == "boxSelect"){
            tools.boxSelect.mouseDown();
        }
        
    }
    document.onpointerup = (e) => {
        if(usingTool == "boxSelect"){
            const tool = tools.boxSelect;
            tool.mouseUp();
            tool.createFrustum();
            for(var i = 0; i < voxels.length; i++){
                for(vertex of voxel.vertexes){
                    const globalVertex = vertex.add(voxels[i].getPosition());
                    //console.log(globalVertex);
                    if(tool.isInFrustum(globalVertex)){
                        addSelect(i);
                        break;
                    }
                }
            }
            tool.reset();
            updateSelections();
            //tool.revertCameraFrustum();
            camera.attachControl(canvas, true);
            usingTool = "";
        }

        clickData.end.x = e.clientX;
        clickData.end.y = e.clientY;

        if(Math.abs(clickData.end.x-clickData.start.x)+Math.abs(clickData.end.y-clickData.start.y) < clickTolerance){
            onClick(e);
        }
    }

    function onClick(e){
        if(e.button == 2 && e.shiftKey){
            if(ghost.visibility){
                addVoxel(ghost.position.subtract(offsetVector), currentColor);
                select(voxels.length-1);
            }
        }else if (e.button == 0){
            if(hovering != -1){
                if(e.shiftKey){
                    if(selected.includes(voxels[hovering].id))
                        deselect(hovering);
                    else
                        addSelect(hovering);
                }else{
                    select(hovering);
                }
            }else{
                deselectAll();
            }
            updateSelections();
        }
        setTimeout(() => {
            castRay(e);
        }, 10);
    }

    document.onkeydown = function keyPress(e){
        if(e.key == "Backspace" || e.key == "x"){
            while (selected.length > 0){
                const index = voxelIndexById(selected.pop());
                deleteVoxel(index);
            }
        }
        if(e.key == "b"){
            camera.detachControl();
            usingTool = "boxSelect";
        }
        if(e.key == "a"){
            selectAll();
            updateSelections();
        }
    }

    return scene;
}
window.onBlobColorChange = function(color){
    currentColor.r = color.r;
    currentColor.g = color.g;
    currentColor.b = color.b;
    currentColor.a = color.a;

    for(voxId of selected){
        const voxel = voxelById(voxId);
        voxel.setColorUnscaled(currentColor);
    }
}
function deleteVoxel(index){
    voxels.splice(index, 1)[0].delete();
}
function addSelect(index){
    if(selected.includes(voxels[index].id)) return;
    selected.push(voxels[index].id);
    currentColor = voxels[index].getColorUnscaled();
    window.setBlobColor(currentColor, true);
}

function select(index){
    deselectAll();
    addSelect(index);
}

function selectAll(){
    deselectAll();
    for(const voxel of voxels){
        selected.push(voxel.id);
    }
}

function deselect(index){
    selected.splice(selected.indexOf(index), 1);
}

function deselectAll(){
    selected.splice(0, selected.length);
}

function updateSelections(){
    for(var i = 0; i < voxels.length; i++){
        voxel = voxels[i];
        if(i == hovering){
            voxel.setHovering();
        }else{
            voxel.setNotHovering();
        }
        if(selected.includes(voxel.id)){
            voxel.setSelected();
        }else{
            //console.log(voxel);
            voxel.setNotSelected();
        }
    }
}

function addVoxel(position, color){
    const newVoxel = new Voxel(cId);
    newVoxel.setPosition(position);
    if(color) newVoxel.setColorUnscaled(color);
    voxels.push(newVoxel);
    cId++;
}

function voxelById(id){
    const voxel = voxels[voxelIndexById(id)]
    return voxel == -1 ? null : voxel;
}
function voxelIndexById(id){
    for (var i = 0; i < voxels.length; i++) {
        if(voxels[i].id == id) return i;
    }
    return -1;
}

window.loadFile = function(e){
    if(e.files.length > 0){
        const file = e.files[0];
        window.readingfile = file;
        file.text().then( ((result) => {
            console.log(result);
            tools.loader.loadFromText(result);
        }) );
    }
    e.value = "";
}
window.loadText = function(text){
    tools.loader.loadFromText(text);
}
window.saveText = function(){
    return tools.saver.save();
}
window.upscale = function(amount, entireModel){
    tools.upscaler.upscale(amount, entireModel);
}

const sceneOut = createScene(); // Call the createScene function
window.doneLoading();
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    sceneOut.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
