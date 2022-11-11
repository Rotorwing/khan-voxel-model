class Upscaler{
    constructor(){
        this.newVoxelData = [];
    }

    upscale(scale, entireModel){
        this.newVoxelData = [];
        scale = Math.floor(scale);
        for(const voxel of voxels){
            const blockPosition = voxel.getPosition().scale(scale);
            const color = voxel.getColorUnscaled()

            for(var x = 0; x < scale; x ++){
                for(var y = 0; y < scale; y ++){
                    for(var z = 0; z < scale; z ++){
                        const newPosition = blockPosition.add(new BABYLON.Vector3(x-1, y-1, z-1));
                        this.newVoxelData.push(new VoxelData(newPosition.x, newPosition.y, newPosition.z,
                            color.r, color.g, color.b, color.a));
                    }
                }
            }
        }

        while(voxels.length > 0){
            deleteVoxel(voxels.length-1);
        }
        deselectAll();
        for(const data of this.newVoxelData){
            //console.log(data);
            addVoxel(new BABYLON.Vector3(data.x, data.y, data.z), new BABYLON.Color4(data.r, data.g, data.b, data.a));
        }
    }
}