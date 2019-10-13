let btn = document.createElement("ul");
const button_html = '<div><div class="mod-indent-outer"><div class="mod-indent"></div><div><div class="activityinstance"><a id="downloaderYoav" class="" onclick="" href="" download="a"><img src="https://raw.githubusercontent.com/norbit8/Moodle-Resource-Fetcher/master/imgs/icon_download.png" class="iconlarge activityicon" alt=" " role="presentation"><span class="instancename">Download resources<span class="accesshide "> File</span></span></a> <span class="resourcelinkdetails"><font color="red">By Yoav Levy</font></span><img id="loadingyoav" style="display: none;" src="https://raw.githubusercontent.com/norbit8/Moodle-Resource-Fetcher/master/imgs/buffering.gif" class="iconlarge activityicon" alt=" " role="presentation"></div></div></div></div>';
btn.innerHTML = button_html;
btn.hidden = true;
document.getElementById("region-main").insertBefore(btn, document.getElementById("region-main").firstChild);

uls = document.getElementsByTagName("ul");

let foundIt;
for (let i = 0; i < uls.length; i++) {
    if (uls[i].className === "topics")
    {
        foundIt = uls[i];
    }
}
let foldersName = [];
let sectionsArray = foundIt.childNodes;
for(let j = 0; j < sectionsArray.length; j++){
    foldersName.push(sectionsArray[j].getAttribute("aria-label"));
}



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
        let dotPDF = "";
        if (allSections[i].getElementsByTagName(keyword).item(j).innerHTML.includes("pdf"))
        {
            dotPDF = ".pdf";
        }
        if (strToPush.includes(RESOURCE)) {
        innerHtmlsList.push([strToPush.substr(6).replace('"','').concat("&redirect=1"), allSections[i]
            .getElementsByTagName(keyword).item(j).innerText.replace('\t\n','')
            .split('\n')[0]+dotPDF, foldersName[i]]);
        }
    }
}
if (innerHtmlsList.length !== 0)
{
    btn.hidden = false;
}

let zip = new JSZip();

document.getElementById("downloaderYoav").onclick = function (e) {
    e.preventDefault();
    document.getElementById("loadingyoav").style.display = "";
    if (innerHtmlsList.length === 0)
    {
        alert("Error: didn't find anything to download.");
    }
    let counter = 0;
    for (let i = 0; i < innerHtmlsList.length; i++) {
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(innerHtmlsList[i][0], function (err, data) {
            if (err) {
                throw err; // or handle the error
            }
            zip.folder(innerHtmlsList[i][2]).file(innerHtmlsList[i][1], data, {binary: true});
            console.log(innerHtmlsList[i][1]);
            counter++;
            if (counter === (innerHtmlsList.length))
            {
                zip.generateAsync({type: "blob"})
                    .then(function (blob) {
                        saveAs(blob, document.title + ".zip");
                    });
                document.getElementById("loadingyoav").style.display = "none";
            }
        });
    }

};
