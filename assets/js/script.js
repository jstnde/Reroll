$(document).ready(function () {

    let reroll = config.REROLL_API
    $("#error-username").hide();

    function getSummoner(sumName, riot_api_url) {

        let query_url = '/tft/summoner/v1/summoners/by-name/'

		const settings = {
			'cache': false,
			'contentType': "application/json",
			"async": true,
			"crossDomain": true,
			"url": riot_api_url + query_url + `${sumName}?` + reroll,
			"method": "GET",
		};

		$.ajax(settings).done(function(response) {
            const sumJSON = JSON.stringify(response);

            sessionStorage.setItem("summonerJSON", sumJSON);

            let getSumJSON = sessionStorage.getItem("summonerJSON")
			let parseSumJSON = JSON.parse(getSumJSON);
			let region = $("#regionSel").val();
			console.log(parseSumJSON.puuid);

            $("#error-username").html(parseSumJSON.name + " " + region).show();
            queryGames(parseSumJSON.puuid, riot_api_url);
        })
			.fail(function() {
            $("#error-username").show().fadeOut(5000);
        });

    }

    // On click show summoner
    $("#searchSum").on("click", function (e) {
        e.preventDefault();
        let sumName = $("#sumName").val();
        let region = $("#regionSel").val();
        let riot_api_url = `https://${region}.api.riotgames.com`;

        getSummoner(sumName, riot_api_url);
    });

    function getLeaderboard(riot_api_url, limit = 50) {
        let query_url = '/tft/league/v1/challenger'

		const settings = {
			'cache': false,
			'contentType': "application/json",
			"async": true,
			"crossDomain": true,
			"url": riot_api_url + query_url + "?" + reroll,
			"method": "GET",
		};

		$.ajax(settings).done(function (response) {
            console.log(response.entries);
            let content = "";

            for (let i = 0; i < limit; i++) {
                let element = response.entries[i];
                // content = `${content}<p>${element.summonerName}</p><br>`;
                content = `${content}<p>${element.summonerName}</p>`
            }
            $("#leaderboard tbody").html(content);
        })
			.fail(function() {
            $("#error-username").show().fadeOut(5000);
        });
    }

    // Onclick show leaderboard
    $("#searchLB").on("click", function (e) {
        e.preventDefault();
        let region = $("#regionSel").val();
        let riot_api_url = `https://${region}.api.riotgames.com`;

        getLeaderboard(riot_api_url);
    });
    
    function queryGames(puuid, riot_api_url){

        let query_url = `/tft/match/v1/matches/by-puuid/${puuid}/ids?count=10&`;        
        let region = $("#regionSel").val();

        if (region === "NA1"){
            region = "americas";
            riot_api_url = `https://${region}.api.riotgames.com`;
        }

		const settings = {
			'cache': false,
			'contentType': "application/json",
			"async": true,
			"crossDomain": true,
			"url": riot_api_url + query_url + reroll,
			"method": "GET",
		};

		$.ajax(settings).done(function (response) {
            // query each match ID
            // console.log(response);
        });
            
    }

	$(".menuBurger").click(function() {
		$(".menuBurger").toggleClass("active");
		$(".navigation").toggleClass("active");
	});
});