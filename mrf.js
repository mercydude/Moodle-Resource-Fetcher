let btn = document.createElement("li");
const button_html = '<div><div class="mod-indent-outer"><div class="mod-indent"></div><div><div class="activityinstance"><a id="downloaderYoav" class="" onclick="" href="" download="a"><img src="https://raw.githubusercontent.com/norbit8/Moodle-Resource-Fetcher/master/icon_download.png" class="iconlarge activityicon" alt=" " role="presentation"><span class="instancename">Download resources<span class="accesshide "> File</span></span></a> <span class="resourcelinkdetails"><font color="red">By Yoav Levy</font></span></div></div></div></div>';
btn.innerHTML = button_html;

document.getElementById("section-0").insertBefore(btn, document.getElementById("section-0").firstChild);

let allSections = document.getElementsByClassName('section img-text');
let innerHtmlsList = [];
let RESOURCE = "resource";
let keyword = "li";
for (let i = 0; i < allSections.length; i++) {
    let itemsListLength = allSections[i].getElementsByTagName(keyword).length;
    itemsListLength = allSections[i].getElementsByTagName(keyword).length;
    for (let j = 0; j < itemsListLength; j++) {
        if (allSections[i].getElementsByTagName(keyword).item(j).innerHTML.includes("href=") === false)
        {
            continue;
        }
        let strToPush = allSections[i].getElementsByTagName(keyword).item(j).innerHTML.match('href=.*?".*?"')[0];
        if (strToPush.includes(RESOURCE)) {
            innerHtmlsList.push(strToPush.substr(6));
        }
    }
}

console.log(innerHtmlsList);

let zip = new JSZip();
document.getElementById("downloaderYoav").onclick = function (e) {
    e.preventDefault();
    if (innerHtmlsList.length === 0)
    {
        alert("Error: didn't find anything to download.");
    }
    for (let i = 0; i < innerHtmlsList.length; i++) {
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(innerHtmlsList[i], function (err, data) {
            if (err) {
                throw err; // or handle the error
            }
            zip.file(`FileNumber_${i}`, data, {binary: true});
            console.log(`Name${i}`);
            if(i === (innerHtmlsList.length - 1))
            {
                zip.generateAsync({type: "blob"})
                    .then(function (blob) {
                        saveAs(blob, "Resources.zip");
                    });
            }
        });
    }
};
