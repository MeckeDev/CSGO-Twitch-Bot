var config = require("./settings.json");
var tmi = require('tmi.js');
var ks = require('node-key-sender');
var fs = require("fs");

ks.setOption('globalDelayPressMillisec', 200);
ks.setOption('globalDelayBetweenMillisec', 600);

var Filter = require('bad-words');
const { execute } = require("node-key-sender");
filter = new Filter();


function randInt(min, max) {
    return Math.random() * (max - min) + min;
};

function send_ingame(text){

    var text = "say \"" + text + "\";";

    fs.writeFile(config.csgo.cfg_folder + 'twitch_bot.cfg', filter.clean(text), (err) => {
        // console.log("saved: " + text);
    });

    ks.sendKey(config.csgo.key_execute_commands);

};

function create_random(change, code=false){

    if (code){
        var result = "apply_crosshair_code " + code
    }
    else if (change == "crosshair"){

        var alpha = Math.floor(randInt(50, 255));
        var thickness = randInt(0, 100);
        var size = Math.floor(randInt(0, 100));
        var gap = Math.floor(randInt(-100, 100));
        var gap_fixed = Math.floor(randInt(-100, 100));
        var outline = Math.floor(randInt(0, 3));
        var style = Math.floor(randInt(0, 5));

        var farbe_rot = Math.floor(randInt(0, 255));
        var farbe_gruen = Math.floor(randInt(0, 255));
        var farbe_blau = Math.floor(randInt(0, 255));

        var dot = Math.floor(randInt(0, 1));

        result = `
cl_crosshairalpha "${alpha}";
cl_crosshaircolor_r "${farbe_rot}";
cl_crosshaircolor_g "${farbe_gruen}";
cl_crosshaircolor_b "${farbe_blau}";
cl_crosshairdot "${dot}";
cl_crosshairgap "${gap}";
cl_crosshairsize "${size}";
cl_crosshairstyle "${style}";
cl_crosshairusealpha "1";
cl_crosshairthickness "${thickness}"
cl_fixedcrosshairgap "${gap_fixed}"
cl_crosshair_outlinethickness "${outline}"
cl_crosshair_drawoutline "1"
        `
    }
    else if (change == "viewmodel"){


        var shift_left = randInt(0, 2);
        var shift_right = randInt(0, 2);
        var fov = randInt(54, 68);
        var righthand = Math.floor(randInt(0, 1));
        var off_x = randInt(-2, 2);
        var off_y = randInt(-2, 2);
        var off_z = randInt(-2, 2);
        var bob_lower = Math.floor(randInt(5, 30));
        var bob_lat = randInt(0, 2);
        var bob_vert = randInt(0, 2);
        var bob_cycle = randInt(0, 2);

        result = `
cl_viewmodel_shift_left_amt "${shift_left}";
cl_viewmodel_shift_right_amt "${shift_right}";
viewmodel_fov "${fov}";
cl_righthand "${righthand}";
viewmodel_offset_x "${off_x}";
viewmodel_offset_y "${off_y}";
viewmodel_offset_z "${off_z}";
cl_bob_lower_amt "${bob_lower}";
cl_bobamt_lat "${bob_lat}";
cl_bobamt_vert "${bob_vert}";
cl_bobcycle "${bob_cycle}"
        `
    }
    else{
        result = ""
    }

    fs.writeFile(config.csgo.cfg_folder + "twitch_bot.cfg", result, (err) => {
        //console.log("saved");
    })

    ks.sendKey(config.csgo.key_execute_commands)

};

function execute_com(text){

    fs.writeFile(config.csgo.cfg_folder + "twitch_bot.cfg", text, (err) => {
        //console.log("saved");
    })

    ks.sendKey(config.csgo.key_execute_commands);
    
};

function check_gun(weapon){

    var guns = {

        "hkp2000": ["P2000", "hkp2000"],
        "usp_silencer": ["usp", "usp-s", "usp_silencer"],
        "glock": ["glock", "glock18", "glock-18"],
        "elite": ["duals", "berettas", "dual berretas", "dualies"],
        "p250": ["p250", "p 250", "p-250"],
        "fn57": ["fiveseven", "five-seven", "57", "5-7"],
        "tec9": ["tec9", "tec-9"],
        "deagle": ["deagle", "desert eagle", "deag"],
        "nova": ["nova"],
        "xm1014": ["xm", "auto shotgun", "autoshotgun", "xm1014", "xm 1014"],
        "mag7": ["mag", "mag7", "mag 7", "mag-7"],
        "sawedoff": ["sawedoff", "abgesägte", "sawed-off", "sawed off"],
        "m249": ["m249"],
        "negev": ["negev"],
        "mp9": ["mp9", "mp 9", "mp-9"],
        "mac10": ["mac10", "mac 10", "mac", "mac-10"],
        "mp7": ["mp-7", "mp7", "mp 7", "mp5", "mp5sd", "mp-5", "mp-5 sd", "mp 5 sd", "mp-5-sd", "mp5-sd"],
        "ump45": ["ump45", "ump", "ump-45", "ump 45"],
        "p90": ["p90", "p-90", "p 90", "pro90", "pro 90", "pro-90"],
        "bizon": ["bizon", "ppbizon", "pp bizon", "pp-bizon"],
        "famas": ["famas"],
        "galilar": ["galil", "galilar", "galol", "galil ar", "galil-ar"],
        "m4a1": ["m4a4", "m4-a4", "m4 a4"],
        "m4a1_silencer": ["m4a1", "m4a1 s", "m4a1-s", "m4a1s"],
        "ak47": ["ak", "ak47", "ak-47", "ak 47"],
        "ssg08": ["ssg08", "ssg", "ssg 08", "ssg-08", "scout"],
        "aug": ["aug"],
        "sg556": ["sg553", "sg 553", "sg-553", "sg", "sg556", "sg 556", "sg-556"],
        "awp": ["awp", "a w p"],
        "scar20": ["auto sniper", "scar", "scar 20", "scar20", "scar-20", "autosniper"],
        "g3sg1": ["g3sg1", "g3", "g3sg"],
        "vest": ["kevlar", "vest", "armor", "rüstung"],
        "vesthelm": ["helmet", "helm", "vesthelm"],
        "taser": ["taser", "zeus", "zeus x27", "zeusx27", "zeus-x27", "shocker", "elektroschocker"],
        "defuser": ["defuser", "defuse kit", "defusekit", "defkit"],
        "incgrenade": ["incendiary", "incgrenade", "ct molly", "ct fire", "ctmolly", "ctfire", "ct-molly", "ct-fire"],
        "molotov": ["molly", "molotov", "t molly", "t fire", "tmolly", "tfire", "t-molly", "t-fire"],
        "decoy": ["decoy", "köder", "ködergranate", "fakegrenade"],
        "flashbang": ["flash", "flashgrenade", "blendgranate", "blend", "blind"],
        "hegrenade": ["he", "grenade", "granate", "nade", "hegrenade"],
        "smokegrenade": ["smoke", "rauch", "rauchgranate", "smokegrenade", "smoke grenade", "smoke-grenade"]
    }

    for (var w in guns){
        if(guns[w].includes(weapon)){
            var result = w
        }
    }
    if(result){
        return result
    }
    else{
        return false
    }
}

function update_cfg(){
    if (!config.csgo.key_execute_commands || !config.csgo.key_reset_crosshair || !config.csgo.key_reset_viewmodel && config.csgo.cfg_folder){
        alert("Do not forget to setup the Keys in the Settings")
    }
    else{

        var text = `

    bind "${config.csgo.key_execute_commands}" "exec twitch_bot"
    bind "${config.csgo.key_reset_crosshair}" "exec crosshair"
    bind "${config.csgo.key_reset_viewmodel}" "exec viewmodel"

    clear

    ECHO ========== READ THIS =============
    ECHO ==================================
    ECHO # Thanks for using my Twitch-Bot # 
    ECHO ==================================
    ECHO
    ECHO Make sure you have created a crosshair.cfg
    ECHO containing only the Commands for your Crosshair
    ECHO or atleast 'apply_crosshair_code YOUR_CROSSHAIRCODE'
    ECHO ----------------------------------
    ECHO You also need a viewmodel.cfg containing all your Viewmodel Commands
    ECHO to get the Settings use the following Workshop-Map
    ECHO https://steamcommunity.com/sharedfiles/filedetails/?id=365126929
    ECHO ----------------------------------
    ECHO === [G]ood [L]uck [H]ave [F]un ===
    ECHO 
    ECHO ====================================
    ECHO 
    ECHO 
        `
        fs.writeFile(config.csgo.cfg_folder + 'mecke_dev.cfg', text, (err) => {
            // console.log("saved: " + text);
        });
    }
}

update_cfg();

/*
# 
# 
Here the Bot tries to Login to the Chat and listen to Messages and checking for Rewards
# 
# 
*/

if (config.login.channelname && config.login.oauth){

    var client = new tmi.Client({
        options: { debug: true },
        connection: { reconnect: true },
        identity: {
            username: config.login.channelname,
            password: config.login.oauth
        },
        channels: [ config.login.channelname ]
    });

    client.connect();

    client.on('message', (channel, tags, message, self) => {

        if (["ceptoplex", "mecke_dev"].includes(tags.username.toLowerCase()) || tags.mod){
            if (message.startsWith("$sens")){
                execute_com("sensitivity " + message.split(" ")[1])
            }
        }

        if (tags["custom-reward-id"] == config.csgo.reward_id_viewmodel){
            create_random("viewmodel");
        }

        if (tags["custom-reward-id"] == config.csgo.reward_id_crosshair){
            if(message.startsWith("CSGO") && message.split("-").length == 6){
                create_random("xhair_code", message);
            }
            else{
                create_random("crosshair");
            }
        }

        if (tags["custom-reward-id"] == config.csgo.reward_id_drop_weapon){

            if(["1", "2", "5"].includes(message) && !message.includes(";")){
                execute_com(`slot${message}; drop;`);
            }
        }

        if (tags["custom-reward-id"] == config.csgo.reward_id_buy_weapon){
            var weapon = check_gun(message.toLowerCase());
            
            if(weapon){
                execute_com("buy " + weapon);
            }
        }

        if (tags["custom-reward-id"] == config.csgo.reward_id_ingame_chat){
            send_ingame(message);
        }

        if (tags["custom-reward-id"]){

            reward_id = tags["custom-reward-id"];
            document.getElementById("set_code").innerHTML = reward_id;

        };

    })
};