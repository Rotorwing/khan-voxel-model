class Saver{
    constructor(){
        this.saveData;
    }

    save(){
        this.download("VoxelModel.txt", this.formatData());
        return this.saveData;
    }

    formatData(){
        let output = "";
        for(var i = 0; i < voxels.length; i++){
            voxel = voxels[i];
            let pos = voxel.getPosition();
            let col = voxel.getColorUnscaled();
            let line = `${Math.round(pos.x-0.5)} ${Math.round(pos.y-0.5)} ${Math.round(pos.z-0.5)} ${Math.round(col.r)} ${Math.round(col.g)} ${Math.round(col.b)} ${Math.round(col.a)}\n`
            
            output += line;
        }
        this.saveData = output;
        return output;
    }

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        element.target = "_blank";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}