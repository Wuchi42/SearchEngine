const APIKEY2 = "AIzaSyA1QDUjaQBX7dKlpzmSDnbiCWKbGF5vJLo"; // some API keys for testing there is a limit for 100 searches per day
const APIKEY = "AIzaSyDDl1vkfSVxfWN-c6kcFrXttcZWiBwv77E";
const APIKEY1 = "AIzaSyAlvvlzwyY9NVlO_rue0VcWywwPA0UBW1I";
const SEARCHKEY = "003621658593238664736:05hft41xpbo"; // this is key of my configuration of searchApi
const APIPERPAGE = 10; // number of result by api, it cannot be more than 10
const LIMIT = 100; // for free search api this is the limit of searches
const SHOWNPERPAGE = 6; // number of shown results per page
let query; // global variable for query
let numberOfShownPages = 0; // this is important for erasing table cells from pages navbar


function fSearchBoxSubmitByEnter(ele) { // if we are in input box we chceck if "enter" is entered we call sumbit function so we do not have to click on submit button
    if (event.key === 'Enter') {
        fSubmit();
    }
}


function fSubmit() { // everytime we search something this function is our gateway
    query = document.getElementById("searchInput").value; // here we set global variable from search box
    if (query !== "") { // if nothing is searched no reason for sending a request
        fRequest(1);  // we always start with 1, cause why start anywhere else
    }
}

function fRequest(start) { // here we send request and also call functions to see results

    let xhr = new XMLHttpRequest();
    let actualPage = 1;
    const URL = "https://www.googleapis.com/customsearch/v1?key=" + APIKEY + "&cx=" + SEARCHKEY + "&q=" + query + "&num=" + APIPERPAGE + "&start=" + start;
    xhr.open("GET", URL, true);
    let checkFetch = function (response) {
        if (!response.ok) {
            if (response.status === 403) {
                throw Error("You reached max searches for today, come back tomorrow");
            } else {
                throw Error(`Request rejected with status ${response.status}`);
            }
        }
        return response;
    };
    fetch(URL)
        .then(checkFetch)
        .then(function () {
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const RESPONSE = JSON.parse(this.responseText);
                        fShowWebResults(RESPONSE);
                        fShowImageResults(RESPONSE);
                        if (start !== 1) { // if start is 1 we have already actual page
                            actualPage = Math.floor(start / SHOWNPERPAGE);  // simple math.floor dividing
                        }
                        fShowNavigation(actualPage, RESPONSE["searchInformation"]["totalResults"]); // after we know we have results we can call results navbar function
                    }
                }
            }

        })
        .catch(function (err) {
            fShowError(err);
        });


}






