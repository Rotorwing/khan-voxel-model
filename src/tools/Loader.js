class Loader{
    constructor(){

    }

    loadFromFile(){

    }
    loadFromText(text){
        const lines = text.split('\n');
        for(const line of lines){
            const parts = line.trim().split(' ');
            if(parts.length <= 1) continue;
            const floatParts = [];
            
            for(const part of parts) floatParts.push(parseFloat(part));

            addVoxel(new BABYLON.Vector3(floatParts[0], floatParts[1], floatParts[2]),
                     new BABYLON.Color4(floatParts[3], floatParts[4], floatParts[5], floatParts[6]));
        }
    }

    openFile(){

    }
}