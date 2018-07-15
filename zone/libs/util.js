function url_decode() {
    const o = document.getElementById('url_output');
    const i = document.getElementById('url_input');
    let v = i.value;
    if (v) {
        o.value = decodeURIComponent(v);
    } else {
        o.value = '';
    }
}

function url_encode() {
    const o = document.getElementById('url_output');
    const i = document.getElementById('url_input');
    let v = i.value;
    if (v) {
        o.value = encodeURIComponent(v);
    } else {
        o.value = '';
    }
}

function url_exchange() {
    const o = document.getElementById('url_output');
    const i = document.getElementById('url_input');
    const v = o.value;
    o.value = i.value;
    i.value = v;
}

function url_clean() {
    const o = document.getElementById('url_output');
    const i = document.getElementById('url_input');
    o.value = '';
    i.value = '';
}

//注释》
function init() {
    const download = document.getElementById('download');
    download.style.visibility = "hidden";
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
    if (!value || value.length == 0) {
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, size, size);
        d.style.visibility = "hidden";
    } else {
        new QRious({
            element: c,
            value: value,
            size: size
        });
        d.style.visibility = "visible";
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
function saveFile(data, filename) {

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
    saveFile(image, '二维码' + (new Date()).getTime() + '.png');
}

window.onReady = function () {
    init();
    initTimeStamp();
    setInterval(initTimeStamp, 1000);
};
