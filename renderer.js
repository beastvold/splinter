const baseURL = 'https://api.splinterlands.io/';

const btnRefresh = document.getElementById("refresh");
btnRefresh.addEventListener("click", refreshPage, false);

function refreshPage() {
    const userOutput = document.getElementById("output");
    // Clear output for refresh
    userOutput.innerHTML = "";

    getSplinterlandsData("cards/get_details").then((cardDB) => {
        // Build our JS Object of cards ids and names
        const cardList = {};
        cardDB.forEach(card => {
            cardList[card.id] = card.name;
        })

        return getSplinterlandsData("market/for_sale").then((listings) => {
            console.log(`Retrieved ${listings.length} listings from the marketplace.`);

            // Filter out all the listings higher than our desired amount.
            const maxAmount = document.getElementById("amount").value;
            console.log(`Searching through listings less than $${maxAmount}.`);
            const filteredListingAmount = listings.filter(listing => parseFloat(listing.buy_price) <= maxAmount);
            console.log(`Found ${filteredListingAmount.length} listings. Sorting by card number...`)

            // Create our empty list of card listings.
            const sortedListingsByCard = [];
            for (let i = 0; i <= cardDB.length; i++) {
                sortedListingsByCard.push([]);
            }

            // Array index is the same as the card number, and the value is an array of listings for that card
            filteredListingAmount.forEach(listing => {
                sortedListingsByCard[listing.card_detail_id].push(listing);
            })
            console.log(sortedListingsByCard);

            // Now, just put all the data into an array, cutting out non-listed cards
            // This new array contains one entry per listed card and stores data for that card in key-value pairs
            const sortedCards = [];
            console.log("Sorting by card value...");
            sortedListingsByCard.forEach(value => {
                // No need to sort if there is just one element
                if (value.length === 1) {
                    const cardStats = {
                        name: cardList[value[0].card_detail_id],
                        lowestPrice: value[0].buy_price,
                        nextLowest: 100000,
                        difference: 100000 - parseFloat(value[0].buy_price)
                    }
                    sortedCards.push(cardStats);
                }
                if (value.length > 1) {
                    // Sort the list in ascending order by buy price
                    value.sort(function(a,b) {
                        if (parseFloat(a.buy_price) > parseFloat(b.buy_price)) return 1;
                        if (parseFloat(a.buy_price) < parseFloat(b.buy_price)) return -1;
                        return 0;
                    });

                    // Add the data to our array
                    const cardStats = {
                        name: cardList[value[0].card_detail_id],
                        lowestPrice: value[0].buy_price,
                        nextLowest: value[1].buy_price,
                        difference: parseFloat(value[1].buy_price) - parseFloat(value[0].buy_price)
                    }
                    sortedCards.push(cardStats);
                }
            })
            
            // Sort cards into descending order, biggest difference first
            sortedCards.sort(function(a,b) {
                if (a.difference < b.difference) return 1;
                if (a.difference > b.difference) return -1;
                return 0;
            })
            console.log(sortedCards);

            sortedCards.forEach((card) => {
                userOutput.innerHTML += `<p>${card.name} for ${card.lowestPrice} has a margin of ${card.difference}.</p>`
            });

            /*
            JulianforSale.forEach((item) => {
                userOutput.innerHTML += `<p>Prince Julian - ${item.seller} - ${item.buy_price}</p>`;
            });

            alert(`${listings[0].seller} has a great deal for you: a ${cardDB[0].name}!`);
            */
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

