function fShowWebResults(response) { // this function handles showing a webResults
    for (let key in response["items"]) {
        if (key < SHOWNPERPAGE) { // we got 10 results from response but only show 6 it is because not every result has an image
            let {displayLink, htmlSnippet, link, title} = response["items"][key];
            fSetInnerHTML("webResult"+ key,"<a href='" + link + "'><h3>" + title + "</h3>" + displayLink + "</a>" + "<p>" + htmlSnippet + "</p>");
        }
    }
}

function fShowImageResults(response) { // here we show an image results
    let i = 0;
    for (let key in response["items"]) {
        let pageMapImage = response["items"][key]["pagemap"];
        if (pageMapImage) { // not all responses has array page map so it will be problem if we do not check this
            if (pageMapImage["cse_thumbnail"] && pageMapImage["cse_image"] && i < SHOWNPERPAGE) { // if we have everything to show image result also we want to show only 6 results per page
                let imageLink = "<a target=\"_blank\" href='" + pageMapImage["cse_image"][0]["src"] + // href for image
                    "'><img src=\"" + pageMapImage["cse_thumbnail"][0]["src"] + "\" width=\"" + pageMapImage["cse_thumbnail"][0]["width"] + "\" height=\"" + pageMapImage["cse_thumbnail"][0]["height"] + "\"> </a>"; // shown image
                let webLink = "<a href=\"" + response["items"][key]["link"] + "\"><h4>" + response["items"][key]["title"] + "</h4>" + response["items"][key]["displayLink"] + "<\a>" // link from response to the source web
                fSetInnerHTML("imageResult"+i,imageLink+webLink);
                i++;
            }
        }
    }
}

function fShowNavigation(actualPage, numberOfResults) {
    let numberOfPages;
    if (actualPage < 1) {
        actualPage = 1
    }
    const ROWNAVIGATION = document.getElementById("resultsNav").rows[0]; // here we get the row of results
    let i;
    if (numberOfResults === 0 || numberOfResults === undefined) { // no pages to show
        numberOfPages = 0
    } else if (numberOfResults >= (LIMIT - APIPERPAGE)) { // more pages than limit so pages are set to limit
        numberOfPages = Math.ceil((LIMIT - APIPERPAGE) / SHOWNPERPAGE);
    } else { // less pages than limit so we get something lesser than limit, but it can happen it will be same result with lesser results on last page
        numberOfPages = Math.ceil(numberOfResults / SHOWNPERPAGE);
    }
    if (numberOfPages > 0) { // if it is not we do not care and just hide everything
        fDisplayBlock("results");
        fHide("noResults");
        for (i = numberOfShownPages - 1; i >= 0; i--) {
            ROWNAVIGATION.deleteCell(i);
        }
        if (numberOfPages > 1) { // if there are more pages than 1 we can show navigation for them
            document.getElementById("resultsNav").style.display = "table";
            for (i = 0; i < numberOfPages; i++) { // for each page result to show we show number to reference it
                let cell = ROWNAVIGATION.insertCell(i); // here we  are creating a cell for a number
                if (i === actualPage - 1) { // if the number is actual page we do not need to reference anything just show it as plain text
                    cell.innerHTML = actualPage;
                } else {
                    cell.innerHTML = "<a " + 'onclick="fRequest(' + ((SHOWNPERPAGE * (i + 1)) + 1) + ')"' + ">" + (i + 1) + "</a>";
                }

            }
            numberOfShownPages = numberOfPages; // here we set number of show pages for next erase of cells
        }
    } else {
        fHide("resultsNav");
        fHide("results");
        fShowError("No results found");
    }
}
function fSetInnerHTML(eleID,innerHTML) {
    document.getElementById(eleID).innerHTML = innerHTML;
}
function fHide(eleID) {
    document.getElementById(eleID).style.display = "none";
}

function fDisplayBlock(eleID) {
    document.getElementById(eleID).style.display = "block";
}
function fShowError(errorMessage){
    fDisplayBlock("noResults");
    fSetInnerHTML("errorText",errorMessage);
}