import html2canvas from "html2canvas";

const width = 1080;
const height = 1080;

const init = () => {
    const target = document.getElementById("sharepic");
    target.style["max-width"] = `${width}px`;
    target.style["aspect-ratio"] = width / height;
}

const loadFile = () => {
    const output = document.getElementById("image");
    const fileElement = document.getElementById("file-upload");
    const zoomElement = document.getElementById("zoom");

    const reader = new FileReader();

    zoomElement.value = 100;

    if (!fileElement.files[0]) {
        return;
    }

    reader.onload = () => {
        output.style["width"] = "unset";
        output.style["height"] = "unset";
        output.src = reader.result;
    }

    output.onload = () => {
        if (output.width > output.height) {
            output.style["height"] = "100%";
        } else {
            output.style["width"] = "100%";
        }
    }
    
    reader.readAsDataURL(fileElement.files[0]);
};

const saveImage = () => {
    const target = document.getElementById("sharepic");
    const scale = width / target.getBoundingClientRect().width;

    target.style.overflow = "hidden";

    html2canvas(target, {
        scale: scale
    }).then(canvas => {
        startDownload(canvas.toDataURL(), 'pink-profile-image.png');
        target.style.overflow = "scroll";
    });
}

const startDownload = (uri, filename) => {
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
}

const setZoom = () => {
    const output = document.getElementById("image");
    const zoom = document.getElementById("zoom").value;

    if (output.width > output.height) {
        output.style["height"] = `${zoom}%`;
    } else {
        output.style["width"] = `${zoom}%`;
    }
}

const fixOverlayPosition = ({target}) => {
    document.querySelectorAll(".overlay").forEach((element) => {
        element.style.transform = `translateX(${target.scrollLeft}px) translateY(${target.scrollTop}px)`;
    });
}

const changeShape = ({target}) => {
    if (target.name == "shape") {
        const roundClass = "round";

        if (target.value == roundClass) {
            document.getElementById("sharepic").classList.add(roundClass);
        } else {
            document.getElementById("sharepic").classList.remove(roundClass);
        }
    }
}

document.getElementById("save-image").addEventListener("click", saveImage);
document.getElementById("file-upload").addEventListener("change", loadFile);
document.getElementById("zoom").addEventListener("change", setZoom);
document.getElementById("sharepic").addEventListener("scroll", fixOverlayPosition)
document.getElementById("shape_selection").addEventListener("change", changeShape);

init();