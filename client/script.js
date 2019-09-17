// *********** Image capturing from video tags *************
// https://odetocode.com/blogs/scott/archive/2013/01/04/capturing-html-5-video-to-an-image.aspx

// ********** Convert base64 image to blob and send *************
// https://stackoverflow.com/questions/34779799/upload-base64-image-with-ajax

const scale = 1;

chrome.tabs.executeScript({
    code: `
    // initialize
    window.videoTag = document.querySelector('video');

    window.captureImageFromVideo = () => {
        let canvas = document.createElement("canvas");
        canvas.width = videoTag.videoWidth * ${scale};
        canvas.height = videoTag.videoHeight * ${scale};
        canvas.getContext('2d').drawImage(videoTag, 0, 0, canvas.width, canvas.height);
        let img = document.createElement("img");
        img.src = canvas.toDataURL();
        return img;
    }

    captureImageFromVideo().src;
    `
}, function(result) {
    // initialize
    src = result[0];
    document.querySelector('#preview').src = src;

    const url = "<your_server_address>/gettext";                
    let image = $('#preview').attr('src');
    let base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    let blob = base64ToBlob(base64ImageContent, 'image/png');
    console.log(blob);           
    let formData = new FormData();
    formData.append('picture', blob);

    $.ajax({
        url: url, 
        type: "POST", 
        cache: false,
        contentType: false,
        processData: false,
        data: formData
    })
    .done(function(e) {
        $('#result').val(e);
    })
    .fail(function(e) {
        alert('error!');
        $('#result').val(e);
    });
});

const base64ToBlob = (base64, mime) => {
    mime = mime || '';
    const sliceSize = 1024;
    let byteChars = window.atob(base64);
    let byteArrays = [];

    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        let slice = byteChars.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}