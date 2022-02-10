let matchList = new Array();
let champList = new Array();
let content = new String();
let placementList = new Array();
let goldleftList = new Array();
let playerelimList = new Array();
let damagetoplayersList = new Array();
let gameinfo = JSON.parse(sessionStorage.getItem("gameInfo"));
let getSum = JSON.parse(sessionStorage.getItem("summonerJSON"));

champList.push("*")

function queryChampList(){
    for (let a = 0; a < gameinfo.length; a++) {
        const game = gameinfo[a];
        for (let i = 0; i < game.info.participants.length; i++) {
            const element = game.info.participants[i];
            if  (element.puuid == getSum.puuid){
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
    let index = 0
    for (let i = 0; i < champList.length; i++) {
        if(champList[i] != "*"){                
            const champion = champList[i];
            content += `
            <td><img src="assets/img/champion/${champion}.png" alt="${champion}" width="50px" height="50px"></td>
            `;
        } else {
            if (placementList.length == index){
                break;
            } else{ 
                content += `
                <td class="break">${placementList[index]}</td>
                <td class="breakright">${goldleftList[index]}</td>
                <td class="breakright">${playerelimList[index]}</td>
                <td class="breakright">${damagetoplayersList[index]}</td>
                `
                index++;
            }
            // break;
            
        } 
        $("#summonerMetaData").html(content)
    }
    $("#lottie").hide();
}

// getSum.summonerLevel

$("#summonerName").html(getSum.name)

console.log(getSum);
console.log(gameinfo);

// Run on load
queryChampList();
queryChampPic(); 

