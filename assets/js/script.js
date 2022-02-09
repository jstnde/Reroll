$(document).ready(function () {

    let reroll = config.REROLL_API
    let matchList = new Array();
    let champList = new Array();
    let content = new String();

    $("#error-username").hide();
    $("#lottie").hide();

    function getSummoner(sumName, riot_api_url) {

        let query_url = '/tft/summoner/v1/summoners/by-name/' 

        var settings = {
            'cache': false,
            'contentType': "application/json",
            "async": true,
            "crossDomain": true,
            "url": riot_api_url + query_url + `${sumName}?` + reroll,
            "method": "GET",
        }

        $.ajax(settings).done(function (response) {
            const sumJSON = JSON.stringify(response);

            sessionStorage.setItem("summonerJSON", sumJSON);
            $("#error-username").show();

            let getSumJSON = sessionStorage.getItem("summonerJSON")
            let parseSumJSON = JSON.parse(getSumJSON);
            console.log(parseSumJSON.puuid);

            let region = $("#regionSel").val();
            $("#error-username").html(parseSumJSON.name + " " + region);
            queryGames(parseSumJSON.puuid, riot_api_url);
            
            for (let i = 0; i < matchList.length; i++) {
                let element = matchList[i];
                console.log(element);
                eachGameInfo(element);
            }            

            let gameinfo = JSON.parse(sessionStorage.getItem("gameInfo"));
            console.log(gameinfo);
            
            queryChampList();
            queryChampPic();                
        });

        $.ajax(settings).fail(function() {
            $("#error-username").show().fadeOut(5000);
        });

    }

    function getLeaderboard(riot_api_url, limit = 50) {

        let query_url = '/tft/league/v1/grandmaster' 

        var settings = {
            'cache': false,
            'contentType': "application/json",
            "async": true,
            "crossDomain": true,
            "url": riot_api_url + query_url + "?" + reroll,
            "method": "GET",
        }

        $.ajax(settings).done(function (response) {
            let content = "";

            for (let i = 0; i < limit; i++) {
                let element = response.entries[i];
                // content = `${content}<p>${element.summonerName}</p><br>`;
                content = `${content}<p>${element.summonerName}</p>`
            }
            $("#leaderboard tbody").html(content);
        });

        $.ajax(settings).fail(function() {
            $("#error-username").show().fadeOut(5000);
        });
    }
    
    function queryGames(puuid, riot_api_url){

        let query_url = `/tft/match/v1/matches/by-puuid/${puuid}/ids?count=10&`;        
        let region = $("#regionSel").val();

        switch (region) {
            case "NA1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;    
                break;
                
            case "BR1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "LA1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "LA2":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "OCE1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "JP1":
                region = "asia";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "KR":
                region = "asia";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;
                  
            case "EUN1":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;
                break; 

            case "EUW1":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "TR1":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break; 

            case "RU":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;  

            default:
                break;
        }

        var settings = {
            'cache': false,
            'contentType': "application/json",
            "async": true,
            "crossDomain": true,
            "url": riot_api_url + query_url + reroll,
            "method": "GET",
        }

        $.ajax(settings).done(function (response) {
            // query each match ID
            matchList = response;
            console.log(matchList);
            for (let i = 0; i < matchList.length; i++) {
                const element = matchList[i];
                eachGameInfo(element)
            }
        });
    }

    function eachGameInfo(matchId){
        let query_url = `/tft/match/v1/matches/${matchId}?`;        
        let region = $("#regionSel").val();

        switch (region) {
            case "NA1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;    
                break;
                
            case "BR1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "LA1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "LA2":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "OCE1":
                region = "americas";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "JP1":
                region = "asia";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "KR":
                region = "asia";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;
                  
            case "EUN1":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;
                break; 

            case "EUW1":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;

            case "TR1":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break; 

            case "RU":
                region = "europe";
                riot_api_url = `https://${region}.api.riotgames.com`;  
                break;  

            default:
                break;
        }

        var settings = {
            'cache': false,
            'contentType': "application/json",
            "async": true,
            "crossDomain": true,
            "url": riot_api_url + query_url + reroll,
            "method": "GET",
        }

        $.ajax(settings).done(function (response) {
            // query each match info
            console.log(response);
            var storedProductList = JSON.parse(sessionStorage.getItem('gameInfo')) || [];
            storedProductList.push(response);
            sessionStorage.setItem('gameInfo', JSON.stringify(storedProductList));
            // Bring user to next page
        });
    }

    function queryChampList(){
        let gameinfo = JSON.parse(sessionStorage.getItem("gameInfo"));
        let getSum = JSON.parse(sessionStorage.getItem("summonerJSON"));

        for (let a = 0; a < gameinfo.length; a++) {
            const game = gameinfo[a];
            for (let i = 0; i < game.info.participants.length; i++) {
                const element = game.info.participants[i];
                if  (element.puuid == getSum.puuid){
                    for (let a = 0; a < element.units.length; a++) {
                        const champion = element.units[a];
                        let champName = champion.character_id.split("_");
                        champList.push(champName[1])
                    }
                    champList.push("*")
                    break;
                }
            }
            
        }
    }

    function queryChampPic(){
        for (let i = 0; i < champList.length; i++) {
            if(champList[i] != "*"){                
                const champion = champList[i];
                content += `<img src="assets/img/champion/${champion}.png" alt="${champion}">`;
                $("#error-username").html(content)
            } else {
                content += `<br>`;
            }
        }
        $("#searchSum").trigger('click');
        $("#lottie").hide();
    }

        // Onclick show leaderboard
    $("#searchLB").on("click", function (e) {
        e.preventDefault();
        let region = $("#regionSel").val();
        let riot_api_url = `https://${region}.api.riotgames.com`;

        getLeaderboard(riot_api_url);
    });

    // On click show summoner
    $("#searchSum").on("click", function (e) {
        e.preventDefault();
        let sumName = $("#sumName").val();
        let region = $("#regionSel").val();
        let riot_api_url = `https://${region}.api.riotgames.com`;

        getSummoner(sumName, riot_api_url);
        $("#lottie").show();
    
    });



});