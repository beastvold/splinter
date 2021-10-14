const baseURL = 'https://api.splinterlands.io/';

const btnRefresh = document.getElementById("refresh");
btnRefresh.addEventListener("click", refreshPage, false);

function refreshPage() {
    const userOutput = document.getElementById("output");
    console.log(userOutput);

    getSplinterlandsData("cards/get_details").then((cardDB) => {
        return getSplinterlandsData("market/for_sale").then((listings) => {
            console.log(`Retrieved ${listings.length} listings from the marketplace.`);

            const JulianforSale = listings.filter(listing => listing.card_detail_id === 205);
            console.log(JulianforSale);
            JulianforSale.forEach((item) => {
                userOutput.innerHTML += `<p>Prince Julian - ${item.seller} - ${item.buy_price}</p>`;
            });

            alert(`${listings[0].seller} has a great deal for you: a ${cardDB[0].name}!`);
        })
    });
}

const getSplinterlandsData = async (url) => {
    console.log(`Fetching Splinterlands data: ${url}...`);
    const fetchURL = baseURL + url;
    const response = await fetch(fetchURL, { method: 'GET', headers: {"Content-Type": "application/json"}});
    console.log(response);
    console.log("Extracting data...");
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);
    return myJson;
}

