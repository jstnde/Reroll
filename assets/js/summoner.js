let matchList = 0;
let champList = new Array();
let content = new String();
let placementList = new Array();
let goldleftList = new Array();
let playerelimList = new Array();
let damagetoplayersList = new Array();
let gameinfo = JSON.parse(sessionStorage.getItem("gameInfo"));
let getSum = JSON.parse(sessionStorage.getItem("summonerJSON"));

// champList.push("*")

function queryChampList(){
    for (let a = 0; a < gameinfo.length; a++) {
        const game = gameinfo[a];
        for (let i = 0; i < game.info.participants.length; i++) {
            const element = game.info.participants[i];
            if  (element.puuid == getSum.puuid){
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
        console.log(matchList);
        if (placementList.length != index){
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
        const d = new Date();
        $("#updateTime").html(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} ${d.getHours() > 12 ? "pm" : "am"}`);

    }
    // console.log($("#sumData tbody").find(".champPics")[0]);
    
    for (let a = 0; a < champList.length; a++) {
        const champion = champList[a];
        let images = $(`<img alt="${champion}" width="30px" height="30px" />`).attr("src",`assets/img/champion/${champion}.png`);
        if(champList[a] != "*"){ 
            images.appendTo($("#sumData tbody").find(".champPics")[b]);
            // $("#sumData tbody").find(".champPics")[b].append(`${image}`);
        } else{
            b++;
            continue;
        }
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

