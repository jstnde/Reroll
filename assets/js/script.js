$(document).ready(function () {
	const user = sessionStorage.getItem("login");
	const loginBtn = $("nav .action li a");

	if (user !== null) {
		loginBtn.html(JSON.parse(user).username);
		loginBtn.attr("href", "profile.html");
	}
	else {
		loginBtn.html("login");
	}

	$("#region-select").html($(".region-option.active").html());
	$("#rank-select").html($(".rank-option.active").html());

    const reroll = config.REROLL_API;
    const db = config.DB_API;
    let matchList = [];

    $("#error-username").hide();
    $("#lottie").hide();

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

            queryGames(parseSumJSON.puuid, riot_api_url);

            for (let i = 0; i < matchList.length; i++) {
                let element = matchList[i];
                console.log(element);
                eachGameInfo(element);
            }

            let gameinfo = JSON.parse(sessionStorage.getItem("gameInfo"));
            console.log(gameinfo);

            setTimeout(function() {redirect()}, 5000);

        });

        $.ajax(settings).fail(function() {
            $("#error-username").show().fadeOut(5000);
            $("#lottie").hide();
        });

    }

    function redirect(){
        window.location.href = "http://localhost:63342/summoner.html"
    }

	function getLeaderboard(riot_api_url, rank, limit = 50) {
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
    
    function queryGames(puuid, riot_api_url){

        let query_url = `/tft/match/v1/matches/by-puuid/${puuid}/ids?count=10&`;
		let region = $(".region-option.active").attr("data-code");

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
		let region = $(".region-option.active").attr("data-code");

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

        const settings = {
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
            let storedProductList = JSON.parse(sessionStorage.getItem('gameInfo')) || [];
            storedProductList.push(response);
            sessionStorage.setItem('gameInfo', JSON.stringify(storedProductList));
            // Bring user to next page
        });
    }

    async function getUsers() {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://reroll-601d.restdb.io/rest/reroll-users",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": db,
                "cache-control": "no-cache"
            }
        }

        return $.ajax(settings);
    }

    async function signIn(userId = null) {
        const username = $("#login-username");
        const password = $("#login-password");
        const error = $(".signInForm form .error-msg");

        username.removeClass("error");
        password.removeClass("error");
        error.css("visibility", "hidden");

        let success = false;
        if (userId === null) {
            const response = await getUsers();
            console.log(response);

            for (const user of response) {
                if (user.Username === username.val() && user.Password === password.val()) {
                    sessionStorage.setItem("login", JSON.stringify({"id": user._id, "username": user.Username}));
                    success = true;
                    break;
                }
            }
        }
        else {
            sessionStorage.setItem("login", JSON.stringify({"id": userId._id, "username": userId.Username}));
            success = true;
        }

        if (success) {
            alert("Sign In Successful!");
            location.href = "index.html";
        }
        else {
            username.addClass("error");
            password.addClass("error");
            error.css("visibility", "visible");
        }
    }

    async function signUp() {
        const response = await getUsers();
        console.log(response);
        const user = $("#register-username");
        const email = $("#register-email");
        const pass = $("#register-password");
        const cpass = $("#register-confirm-password");
        const error = $(".signUpForm form .error-msg");
        let taken = [];

        user.removeClass("error");
        pass.removeClass("error");
        cpass.removeClass("error");
        error.css("visibility", "hidden");

        for (const user of response) {
            taken.push(user.Username);
        }

        if (taken.includes(user.val())) {
            user.addClass("error");
            error.find("small").html("username taken");
            error.css("visibility", "visible");
            return;
        }
        else if (pass.val() !== cpass.val()) {
            pass.addClass("error");
            cpass.addClass("error");
            error.find("small").html("passwords do not match");
            error.css("visibility", "visible");
            return;
        }

        const jsondata = {
            "Username": user.val(),
            "Email": email.val(),
            "Password": pass.val(),
            "Favourites": ""
        };

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://reroll-601d.restdb.io/rest/reroll-users",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "x-apikey": db,
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(jsondata)
        };

        return $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }

    // on hide modal -> submit
    $('#filterModal').on('hidden.bs.modal', function () {
        $(".searchLB").submit();
    });

    // on submit show leaderboard
    $(".searchLB").submit(function (e) {
        e.preventDefault();
        const region = $(".region-option.active").attr("data-code");
        const riot_api_url = `https://${region}.api.riotgames.com`;
        const rank = $(".rank-option.active").attr("data-rank");
        getLeaderboard(riot_api_url, rank);
    });

    // on submit show summoner
    $(".searchSum").submit(function (e) {
        e.preventDefault();
        let sumName = $("#sumName").val();
        let region = $(".region-option.active").attr("data-code");
        let riot_api_url = `https://${region}.api.riotgames.com`;

        getSummoner(sumName, riot_api_url);
        $("#lottie").show();
    });

    $(".menuBurger").click(function() {
        $(".menuBurger").toggleClass("active");
        $(".navigation").toggleClass("active");
    });

    $(".region-option").click(function () {
        $(".region-option.active").removeClass("active");
        $(this).addClass("active");
        $("#region-select").html($(this).html());
    });

    $(".rank-option").click(function () {
        $(".rank-option.active").removeClass("active");
        $(this).addClass("active");
        $("#rank-select").html($(this).html());
    });

    $(".signUpBtn").click(function() {
        $(".form-container").addClass("active");
    });

    $(".signInBtn").click(function() {
        $(".form-container").removeClass("active");
    });

    $(".signInForm").submit(async function(e) {
        e.preventDefault();
        await signIn();
    });

    $(".signUpForm").submit(async function(e) {
        e.preventDefault();
        await signIn(await signUp());
    });
});