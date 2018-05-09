

function init() {
    const d = document.getElementById('download');
    d.style.visibility="hidden";
}

function initTimeStamp() {

    const time = document.getElementById('time');
    time.innerHTML = new Date();

    const unixts = document.getElementById('unixts');
    unixts.innerHTML = Math.round((new Date()).getTime() / 1000);
}

function generate(value) {
    const c = document.getElementById('qr');
    const d = document.getElementById('download');

    const size = 240;
    if (!value || value.length == 0){
        const ctx = c.getContext("2d");
        ctx.clearRect(0,0,size,size);
        d.style.visibility="hidden";
    }else {
        new QRious({
            element: c,
            value: value,
            size: size
        });
        d.style.visibility="visible";
    }
};

function OnInput(event) {
    generate(event.target.value);
}

// Internet Explorer
function OnPropChanged(event) {
    if (event.propertyName.toLowerCase() == "value") {
        generate(event.srcElement.value);
    }
}

/**
 * 在本地进行文件保存
 * @param  {String} data     要保存到本地的图片数据
 * @param  {String} filename 文件名
 */
function saveFile (data, filename) {

    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};

function saveAsLocalImage() {
    var myCanvas = document.getElementById("qr");
    var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // window.location.href = image; // it will save locally
    saveFile(image,'二维码' + (new Date()).getTime() + '.png');
}

window.onReady = function () {
    init();
    initTimeStamp();
    setInterval(initTimeStamp, 1000);
};
