const reroll = config.REROLL_API;
const region = "NA1";
const riot_api_url = `https://${region}.api.riotgames.com`;
const rank = "grandmaster";

function getLeaderboard(riot_api_url, rank, limit = 15) {
    console.log("Loading leaderboard..");
    const query_url = `/tft/league/v1/${rank}`;
    const settings = {
        'cache': false,
        'contentType': "application/json",
        "async": true,
        "crossDomain": true,
        "url": riot_api_url + query_url + "?" + reroll,
        "method": "GET",
    }

    $.ajax(settings).done(function (response) {
        let content = "";

        console.log(response);
        for (let i = 0; i < limit; i++) {
            let percentWin = 0;
            let element = response.entries[i];
            let totalGames = element.wins + element.losses;
            percentWin = element.wins/totalGames * 100;
            console.log(element.summonerId);
            content = `${content}<tr id='${element.summonerId}'>
            <td>${i + 1}</td>\t
            <td>${element.summonerName}</td>\t
            <td>${element.leaguePoints}</td>\t
            <td>${element.rank}</td>\t
            <td>${totalGames}</td>\t
            <td>${percentWin.toFixed(2)}</td>`
        }
        $("#leaderboard tbody").html(content);
        const d = new Date();
        $("#updateTime b").html(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} ${d.getHours() > 12 ? "pm" : "am"}`);
    })
        .fail(function() {
        $("#error-username").show().fadeOut(5000);
    });
}

getLeaderboard(riot_api_url, rank);
