$(document).ready(function() {
	const reroll = config.REROLL_API;
	const db = config.DB_API;
	const user = sessionStorage.getItem("login");
	const loginBtn = $("nav .action li a");

	hideLottie();
	$("#region-select").html($(".region-option.active").html());
	$("#rank-select").html($(".rank-option.active").html());
	$("#error-username").hide();

	function showLottie() {
		$(".lottie").show();
	}

	function hideLottie() {
		$(".lottie").hide();
	}

	if (user !== null) {
		loginBtn.html(JSON.parse(user).username);
		loginBtn.attr("href", "profile.html");
	}
	else {
		loginBtn.html("Login");
	}

	if (location.href.includes("index.html") || !location.href.includes(".html")) {
		$("header").css("background-color", "transparent").css("box-shadow", "none");
		$("main").css("align-items", "center");
	}
	else if (location.href.includes("leaderboard.html")) {
		const region = $(".region-option.active").attr("data-code");
		const riot_api_url = `https://${region}.api.riotgames.com`;
		const rank = $(".rank-option.active").attr("data-rank");
		getLeaderboard(riot_api_url, rank, region);
	}
	else if (location.href.includes("summoner.html")) {
		const summonerDetails = JSON.parse(sessionStorage.getItem("summonerDetails"));
		getSummoner(summonerDetails.name, summonerDetails.region);
	}
	else if (location.href.includes("profile.html")) {
		getFavourites();
	}

	function getSummoner(sumName, region) {
		const riot_api_url = `https://${region}.api.riotgames.com`;
		const query_url = '/tft/summoner/v1/summoners/by-name/';

		const settings = {
			"cache": false,
			"contentType": "application/json",
			"async": true,
			"crossDomain": true,
			"url": `${riot_api_url}${query_url}${sumName}?${reroll}`,
			"method": "GET",
			"beforeSend": showLottie()
		};

		$.ajax(settings).done(async function(response) {
			$("#summoner-name_text").html(`${sumName}<small>#${region}</small>`);
			$(".like-btn").attr("id", response.id);

			if (user !== null) {
				let favourites;

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

				await $.ajax(settings).done(function(response) {
					favourites = JSON.parse(response.Favourites);
					hideLottie();
				});

				for (const f of favourites) {
					const btn = $(".like-btn");
					const heart = btn.find("span");
					const info = $('.like-btn .info');
					if (f.id === response.id && f.region === region) {
						btn.addClass("active");
						btn.addClass("active-2");
						setTimeout(function() {
							heart.addClass("fa-heart");
							heart.removeClass("fa-heart-o");
						}, 150);
						setTimeout(function() {
							btn.addClass("active-3");
						}, 150);
						info.addClass("info-tog");
						setTimeout(function() {
							info.removeClass("info-tog");
						}, 1000);
					}
				}
			}

			queryGames(response.puuid, region);
		})
			.fail(function() {
				$("#summoner-name_text").html(`${sumName}<small>#${region}</small>`);
				const profile = `<img class="profile-icon" src="assets/img/default.png" alt="default">`
				$(".summonerInfo").prepend(profile);
				hideLottie();
				$(".overlay").show();
			});
	}

	function getLeaderboard(riot_api_url, rank, region, limit = 15) {
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

		$.ajax(settings).done(function(response) {
			hideLottie();
			let content = "";
			console.log(response);
			const entries = response.entries.sort((a, b) => (a.leaguePoints < b.leaguePoints) ? 1 : ((b.leaguePoints < a.leaguePoints) ? -1 : 0))

			if (entries.length < limit) {
				content = "<tr><td colspan='6' style='text-align: center'>No entries to display.</td></tr>"
				$("#leaderboard tbody").html(content);
				const d = new Date();
				$("#updateTime b").html(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} ${d.getHours() > 12 ? "pm" : "am"}`);
				return;
			}

			for (let i = 0; i < limit; i++) {
				let percentWin = 0;
				const element = entries[i];
				const totalGames = element.wins + element.losses;
				percentWin = element.wins / totalGames * 100;
				content = `${content}<tr class="table-row" id="${element.summonerName};;;${region}">
                <td>${i + 1}</td>\t
                <td>${element.summonerName}</td>\t
                <td>${element.leaguePoints}</td>\t
                <td>${rank.charAt(0).toUpperCase() + rank.slice(1)} ${element.rank}</td>\t
                <td>${totalGames}</td>\t
                <td>${percentWin.toFixed(2)}</td></tr>`;
			}


			$("#leaderboard tbody").html(content);
			const d = new Date();
			$("#updateTime b").html(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} ${d.getHours() > 12 ? "pm" : "am"}`);

			$(".table-row").click(function() {
				const data = $(this).attr("id").split(";;;");

				sessionStorage.setItem("summonerDetails", JSON.stringify({
					"name": data[0],
					"region": data[1]
				}));

				location.href = "summoner.html";
			});
		});
	}

	function queryGames(puuid, region) {
		let query_url = `/tft/match/v1/matches/by-puuid/${puuid}/ids?count=10&`;

		switch (region) {
			case "NA1":
				region = "americas";
				break;
			case "BR1":
				region = "americas";
				break;
			case "LA1":
				region = "americas";
				break;
			case "LA2":
				region = "americas";
				break;
			case "OCE1":
				region = "americas";
				break;
			case "JP1":
				region = "asia";
				break;
			case "KR":
				region = "asia";
				break;
			case "EUN1":
				region = "europe";
				break;
			case "EUW1":
				region = "europe";
				break;
			case "TR1":
				region = "europe";
				break;
			case "RU":
				region = "europe";
				break;
			default:
				break;
		}

		const riot_api_url = `https://${region}.api.riotgames.com`;

		const settings = {
			"cache": false,
			"contentType": "application/json",
			"async": true,
			"crossDomain": true,
			"url": riot_api_url + query_url + reroll,
			"method": "GET",
			"beforeSend": showLottie()
		};

		$.ajax(settings).done(async function(response) {
			let responses = [];
			let content = "";
			let champion = null;

			for (const element of response) {
				responses.push(await eachGameInfo(element, riot_api_url));
			}

			if (responses.length === 0) {
				const profile = `<img class="profile-icon" src="assets/img/default.png" alt="default">`
				$(".summonerInfo").prepend(profile);
				const d = new Date();
				$("#updateTime b").html(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} ${d.getHours() > 12 ? "pm" : "am"}`);
				content = `<tr><td colspan='6' style='text-align: center;'>No Recent Match Data</td></tr>`;
				$("#sumData tbody").html(content);
				hideLottie();
				return;
			}

			for (const r of responses) {
				for (const p of r.info.participants) {
					if (p.puuid === puuid) {
						let champPics = "";
						for (const u of p.units) {
							const name = u.character_id.split("_")[1];
							champPics += `<img src="assets/img/champion/${name}.png" alt="${name}" style="width: 30px; height: 30px;">`;
							champion = champion ?? name;
						}
						content = `${content}<tr>
			                <td>${p.placement}</td>
			                <td><div class="champPics">${champPics}</div></td>
			                <td>${p.gold_left}</td>
			                <td>${p.players_eliminated}</td>
			                <td>${p.total_damage_to_players}</td></tr>`;

						$("#sumData tbody").html(content);
					}
				}
			}

			const d = new Date();
			$("#updateTime b").html(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} ${d.getHours() > 12 ? "pm" : "am"}`);
			const profile = `<img class="profile-icon" src="assets/img/champion/${champion}.png" alt="${champion}">`
			$(".summonerInfo").prepend(profile);
			hideLottie();
		});
	}

	async function eachGameInfo(matchId, riot_api_url) {
		let query_url = `/tft/match/v1/matches/${matchId}?`;

		const settings = {
			"cache": false,
			"contentType": "application/json",
			"async": true,
			"crossDomain": true,
			"url": riot_api_url + query_url + reroll,
			"method": "GET",
			"beforeSend": showLottie()
		}

		return $.ajax(settings);
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
						"username": user.Username
					}));
					success = true;
					break;
				}
			}
		}
		else {
			sessionStorage.setItem("login", JSON.stringify({
				"id": cuser._id,
				"username": cuser.Username
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
			"Favourites": JSON.stringify([])
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

		return $.ajax(settings).done(function(response) {
			console.log(response);
			hideLottie();
		});
	}

	async function getFavourites() {
		if (user !== null) {
			let content = "";
			let responses = [];
			let favourites;

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

			await $.ajax(settings).done(function(response) {
				favourites = JSON.parse(response.Favourites);
				hideLottie();
			});

			if (favourites.length === 0) {
				content = "<tr><td colspan='6' style='text-align: center;'>No Favourites To Display</td></tr>";
				$("#favourites tbody").html(content);
				return;
			}

			for (const f of favourites) {
				const settings = {
					"cache": false,
					"contentType": "application/json",
					"async": true,
					"crossDomain": true,
					"url": `https://${f.region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${f.id}?${reroll}`,
					"method": "GET",
					"beforeSend": showLottie()
				};

				await $.ajax(settings).done(function(response) {
					responses.push(response);
					hideLottie();
				});
			}
			console.log(responses)
			let count = 0;
			for (let r of responses) {
				if (r.length === 0) {
					const settings = {
						"cache": false,
						"contentType": "application/json",
						"async": true,
						"crossDomain": true,
						"url": `https://${favourites[count].region}.api.riotgames.com/tft/summoner/v1/summoners/${favourites[count].id}?${reroll}`,
						"method": "GET",
						"beforeSend": showLottie()
					};

					await $.ajax(settings).done(function(response) {
						content = `${content}<tr class="table-row" id='${response.name};;;${favourites[count].region}'>` +
							`<td>${count + 1}</td>` +
							`<td>${response.name}</td>` +
							"<td colspan='4' style='text-align: center;'>Not available.</td>" +
							"</tr>";
						$("#favourites tbody").html(content);
						hideLottie();
					});
				}
				else {
					let user = r[0];
					let percentWin = 0;
					let totalGames = user.wins + user.losses;
					percentWin = user.wins / totalGames * 100;
					content = `${content}<tr class="table-row" id='${user.summonerName};;;${favourites[count].region}'>
					<td>${count + 1}</td>\t
					<td>${user.summonerName}</td>\t
					<td>${user.leaguePoints}</td>\t
					<td>${user.tier} ${user.rank}</td>\t
					<td>${totalGames}</td>\t
					<td>${percentWin.toFixed(2)}</td></tr>`
				}
				count++;
			}

			$("#favourites tbody").html(content);

			$(".table-row").click(function() {
				const data = $(this).attr("id").split(";;;");

				sessionStorage.setItem("summonerDetails", JSON.stringify({
					"name": data[0],
					"region": data[1]
				}));

				location.href = "summoner.html";
			});
		}
		else {
			location.href = "index.html";
		}
	}

	// on hide modal -> submit
	$("#filterModal").on("hidden.bs.modal", function() {
		$(".searchLB").submit();
	});

	// on submit show leaderboard
	$(".searchLB").submit(function(e) {
		e.preventDefault();
		const region = $(".region-option.active").attr("data-code");
		const riot_api_url = `https://${region}.api.riotgames.com`;
		const rank = $(".rank-option.active").attr("data-rank");
		getLeaderboard(riot_api_url, rank, region);
	});

	// on submit show summoner
	$(".searchSum").submit(function(e) {
		e.preventDefault();
		let sumName = $("#sumName").val();
		let region = $(".region-option.active").attr("data-code");
		sessionStorage.setItem("summonerDetails", JSON.stringify({
			"name": sumName,
			"region": region
		}));

		location.href = "summoner.html";
	});

	$(".menuBurger").click(function() {
		$(".menuBurger").toggleClass("active");
		$(".navigation").toggleClass("active");
	});

	$(".region-option").click(function() {
		$(".region-option.active").removeClass("active");
		$(this).addClass("active");
		$("#region-select").html($(this).html());
	});

	$(".rank-option").click(function() {
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

	$(".signOutBtn").click(function() {
		sessionStorage.removeItem("login");
		location.href = "index.html";
	});

	$('.like-btn').click(async function() {
		if (user === null) {
			const overlay = $(".overlay div");
			overlay.find("h3").html("Login required for this feature.");
			overlay.find("a").attr("href", "#");
			overlay.find("a button").click(function() {
				$(".overlay").hide();
			});
			$(".overlay").show();
			return;
		}

		let favourites;

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

		await $.ajax(settings).done(function(response) {
			favourites = JSON.parse(response.Favourites);
			hideLottie();
		});

		const btn = $(".like-btn");
		const heart = btn.find("span");
		const info = $('.like-btn .info');
		if (heart.hasClass("fa-heart")) {
			btn.removeClass("active");
			setTimeout(function() {
				btn.removeClass("active-2");
			}, 30);
			btn.removeClass("active-3");
			setTimeout(function() {
				heart.removeClass("fa-heart");
				heart.addClass("fa-heart-o");
			}, 15);

			favourites.splice(favourites.findIndex(
				value => value.id === btn.attr("id")
			), 1);

			const jsondata = {
				"Favourites": JSON.stringify(favourites)
			};

			const settings = {
				"async": true,
				"crossDomain": true,
				"url": `https://reroll-601d.restdb.io/rest/reroll-users/${JSON.parse(user).id}`,
				"method": "PUT",
				"headers": {
					"content-type": "application/json",
					"x-apikey": db,
					"cache-control": "no-cache"
				},
				"processData": false,
				"data": JSON.stringify(jsondata)
			}

			$.ajax(settings).done(function(response) {
				console.log(response);
			});
		}
		else {
			btn.addClass("active");
			btn.addClass("active-2");
			setTimeout(function() {
				heart.addClass("fa-heart");
				heart.removeClass("fa-heart-o");
			}, 150);
			setTimeout(function() {
				btn.addClass("active-3");
			}, 150);
			info.addClass("info-tog");
			setTimeout(function() {
				info.removeClass("info-tog");
			}, 1000);

			favourites.push({
				"id": btn.attr("id"),
				"region": $("#summoner-name_text small").html().slice(1, $("#summoner-name_text small").html().length)
			});

			const jsondata = {
				"Favourites": JSON.stringify(favourites)
			};

			const settings = {
				"async": true,
				"crossDomain": true,
				"url": `https://reroll-601d.restdb.io/rest/reroll-users/${JSON.parse(user).id}`,
				"method": "PUT",
				"headers": {
					"content-type": "application/json",
					"x-apikey": db,
					"cache-control": "no-cache"
				},
				"processData": false,
				"data": JSON.stringify(jsondata)
			}

			$.ajax(settings).done(function(response) {
				console.log(response);
			});
		}
	});
});