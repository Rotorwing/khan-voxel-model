class ColorBlob {
    constructor(id, color){
        this.id = id;
        this.color = color || {
            r:0,
            g:0,
            b:0,
            a:255,
        }
        this.element = document.createElement('div');
        this.element.classList.add("colorBlob");
        this.element.id = "colorB"+id;
        this.element.style.zIndex = 50;
        //this.element.style.backgroundColor = `rgb(${this.r}, ${this.g}, ${this.b}`;
        this.setColor({});

        this.onChanged;

        this.element.onmousedown = (e) =>{
            e = e || window.event;
            e.preventDefault();
            if(!window.draggingBlob){
                window.draggingBlob = new ColorBlob(-1, this.color);
                const el = window.draggingBlob.getElement();
                el.style.position = "absolute";
                el.style.pointerEvents = "none";
                document.body.appendChild(el);
            }
            document.onmousemove = (e)=>{
                const el = window.draggingBlob.getElement();
                el.style.top = e.clientY-el.clientHeight/2+"px";
                el.style.left = e.clientX-el.clientHeight/2+"px";
            }
            document.onmousemove(e);
            document.onmouseup = () => {
                document.onmousemove = null;

                if(window.dropBlobOn){
                    console.log(window.dropBlobOn.color, window.draggingBlob.color);
                    window.dropBlobOn.setColor(window.draggingBlob.color);
                    if(window.dropBlobOn.onChanged) window.dropBlobOn.onChanged(window.draggingBlob.color);
                }

                window.draggingBlob.getElement().remove();
                window.draggingBlob = null;
                document.onmouseup = null;
            }
        }
        this.element.onmouseenter = ()=>{
            window.dropBlobOn = this;
        }
        this.element.onmouseleave = ()=>{
            window.dropBlobOn = null;
        }
    }

    getElement(){
        return this.element;
    }

    setColor(color){
        if(color.r != null) this.color.r = color.r;
        if(color.g != null) this.color.g = color.g;
        if(color.b != null) this.color.b = color.b;
        if(color.a != null) this.color.a = color.a;
        this.element.style.backgroundColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b}`;
    }
}