$(document).ready(function () {
	const reroll = config.REROLL_API;
	const db = config.DB_API;
	const user = sessionStorage.getItem("login");
	const loginBtn = $("nav .action li a");
	let matchList = 0;
    let champList = new Array();
    let content = new String();
    let placementList = new Array();
    let goldleftList = new Array();
    let playerelimList = new Array();
    let damagetoplayersList = new Array();
    let gameinfo = JSON.parse(sessionStorage.getItem("gameInfo"));
    let getSum = JSON.parse(sessionStorage.getItem("summonerJSON"));

	hideLottie();
	$("#region-select").html($(".region-option.active").html());
	$("#rank-select").html($(".rank-option.active").html());
    $("#error-username").hide();


	if (user !== null) {
		loginBtn.html(JSON.parse(user).username);
		loginBtn.attr("href", "profile.html");
	}
	else {
		loginBtn.html("Login");
	}

	if (location.href.includes("leaderboard.html")) {
		const region = $(".region-option.active").attr("data-code");
		const riot_api_url = `https://${region}.api.riotgames.com`;
		const rank = $(".rank-option.active").attr("data-rank");
		getLeaderboard(riot_api_url, rank);
	} else if(location.href.includes("summoner.html")){
        queryChampList();
        queryChampPic();
    }

	function showLottie() {
		$(".lottie").show();
	}

	function hideLottie() {
		$(".lottie").hide();
	}

    function getSummoner(sumName, riot_api_url) {

        let query_url = '/tft/summoner/v1/summoners/by-name/'

		const settings = {
			"cache": false,
			"contentType": "application/json",
			"async": true,
			"crossDomain": true,
			"url": riot_api_url + query_url + `${sumName}?` + reroll,
			"method": "GET",
			"beforeSend": showLottie()
		};

		$.ajax(settings).done(function(response) {
			hideLottie();
            const sumJSON = JSON.stringify(response);

            sessionStorage.setItem("summonerJSON", sumJSON);

            let getSumJSON = sessionStorage.getItem("summonerJSON")
			let parseSumJSON = JSON.parse(getSumJSON);
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
        location.href = "summoner.html";
    }

	function getLeaderboard(riot_api_url, rank, limit = 15) {
		console.log("Loading leaderboard..");
		const query_url = `/tft/league/v1/${rank}`;

        const settings = {
            "cache": false,
            "contentType": "application/json",
            "async": true,
            "crossDomain": true,
            "url": riot_api_url + query_url + "?" + reroll,
            "method": "GET",
			"beforeSend": showLottie()
        }

        $.ajax(settings).done(function (response) {
			hideLottie();
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
                <td>${percentWin.toFixed(2)}</td></tr>`
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
			"cache": false,
			"contentType": "application/json",
			"async": true,
			"crossDomain": true,
			"url": riot_api_url + query_url + reroll,
			"method": "GET",
			"beforeSend": showLottie()
		};

		$.ajax(settings).done(function (response) {
			hideLottie();
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
            "cache": false,
            "contentType": "application/json",
            "async": true,
            "crossDomain": true,
            "url": riot_api_url + query_url + reroll,
            "method": "GET",
			"beforeSend": showLottie()
        }

        $.ajax(settings).done(function (response) {
			hideLottie();
            // query each match info
            console.log(response);
            let storedProductList = JSON.parse(sessionStorage.getItem('gameInfo')) || [];
            storedProductList.push(response);
            sessionStorage.setItem('gameInfo', JSON.stringify(storedProductList));
            // Bring user to next page
        });
    }

    function queryChampList(){
        for (let a = 0; a < gameinfo.length; a++) {
            const game = gameinfo[a];
            for (let i = 0; i < game.info.participants.length; i++) {
                const element = game.info.participants[i];
                if  (element.puuid === getSum.puuid){
                    matchList++;
                    placementList.push(element.placement)
                    goldleftList.push(element.gold_left)
                    playerelimList.push(element.players_eliminated)
                    damagetoplayersList.push(element.total_damage_to_players)
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
        let index = 0;
        let b = 0;
        for (let i = 0; i < matchList; i++) {
            if (placementList.length !== index){
                content = `${content}
                <tr>${getSum.character_id}</tr>
                <td>${placementList[index]}</td>
                <td><div class="champPics"></div></td>
                <td>${goldleftList[index]}</td>
                <td>${playerelimList[index]}</td>
                <td>${damagetoplayersList[index]}</td>
                `;
                index++;
            } else {
                break;
            }          
            $("#sumData tbody").html(content)
            $("#summonerName").html(getSum.name)
            const d = new Date();
            $("#updateTime").html(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} ${d.getHours() > 12 ? "pm" : "am"}`);
    
        }
        
        for (let a = 0; a < champList.length; a++) {
            const champion = champList[a];
            let images = $(`<img alt="${champion}" width="30px" height="30px" />`).attr("src",`assets/img/champion/${champion}.png`);
            if(b == matchList){
                break;
            } else{
                if(champList[a] !== "*"){
                    images.appendTo($("#sumData tbody").find(".champPics")[b]);
                } else {
                    b++;
                }
            }
        }
    
        const champion = champList[1];
        let profile = $(`<img alt="${champion}" class="profile-icon"/>`).attr("src",`assets/img/champion/${champion}.png`);
        $(".summonerInfo").prepend(profile);
        $(".lottie").hide();
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
            },
			"beforeSend": showLottie()
        }

        return $.ajax(settings).done(function() {
			hideLottie();
		});
    }

    async function signIn(cuser = null) {
		showLottie();
        const username = $("#login-username");
        const password = $("#login-password");
        const error = $(".signInForm form .error-msg");

        username.removeClass("error");
        password.removeClass("error");
        error.css("visibility", "hidden");

        let success = false;
        if (cuser === null) {
            const response = await getUsers();
            console.log(response);

            for (const user of response) {
                if (user.Username === username.val() && user.Password === password.val()) {
                    sessionStorage.setItem("login", JSON.stringify({
						"id": user._id,
						"username": user.Username,
						"favourites": user.Favourites
					}));
                    success = true;
                    break;
                }
            }
        }
        else {
            sessionStorage.setItem("login", JSON.stringify({
				"id": cuser._id,
				"username": cuser.Username,
				"favourites": cuser.Favourites
			}));
            success = true;
        }

		hideLottie();
        if (success) {
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
            "data": JSON.stringify(jsondata),
			"beforeSend": showLottie()
        };

        return $.ajax(settings).done(function (response) {
            console.log(response);
			hideLottie();
        });
    }

    // on hide modal -> submit
    $("#filterModal").on("hidden.bs.modal", function () {
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

	$("#favourites").ready(async function() {
		if (location.href.includes("profile.html")) {
			if (user !== null) {
				let favourites = "";
				let content = "";
				let responses = [];

				const settings = {
					"async": true,
					"crossDomain": true,
					"url": `https://reroll-601d.restdb.io/rest/reroll-users/${JSON.parse(user).id}`,
					"method": "GET",
					"headers": {
						"content-type": "application/json",
						"x-apikey": db,
						"cache-control": "no-cache"
					},
					"beforeSend": showLottie()
				}

				await $.ajax(settings).done(function (response) {
					favourites = response.Favourites;
					hideLottie();
				});

				favourites = favourites.split(",");
				for (const favourite of favourites) {
					const f = favourite.split('.');
					const settings = {
						"cache": false,
						"contentType": "application/json",
						"async": true,
						"crossDomain": true,
						"url": `https://${f[0]}.api.riotgames.com/tft/league/v1/entries/by-summoner/${f[1]}?${reroll}`,
						"method": "GET",
						"beforeSend": showLottie()
					};

					await $.ajax(settings).done(function (response) {
						responses.push(response[0]);
						hideLottie();
					});
				}

				responses = responses.sort((a, b) => (a.leaguePoints < b.leaguePoints) ? 1 : ((b.leaguePoints < a.leaguePoints) ? -1 : 0))
				let count = 0;
				for (const r of responses) {
					console.log(r.summonerId);
					let percentWin = 0;
					let totalGames = r.wins + r.losses;
					percentWin = r.wins / totalGames * 100;
					content = `${content}<tr id='${r.summonerId}'>
						<td>${count + 1}</td>\t
						<td>${r.summonerName}</td>\t
						<td>${r.leaguePoints}</td>\t
						<td>${r.tier} ${r.rank}</td>\t
						<td>${totalGames}</td>\t
						<td>${percentWin.toFixed(2)}</td></tr>`
					count++;
				}

				$("#favourites tbody").html(content);
			}
			else {
				location.href = "index.html";
			}
		}
	});

	$(".signOutBtn").click(function() {
		sessionStorage.removeItem("login");
		location.href = "index.html";
	});
});