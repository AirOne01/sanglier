const axios = require("axios");
const { MessageEmbed } = require("discord.js")

exports.run = (client, msg, args) => {
  if (args.length < 2) return msg.reply("Syntaxe: `osu [user/bm] <cible>`");
  msg.channel.sendTyping();

  axios({
    url: "https://osu.ppy.sh/oauth/token",
    method: "post",
    data: {
      grant_type: "client_credentials",
      client_id: client.config.osuId,
      client_secret: client.config.osuSecret,
      scope: "public",
    },
  })
    .then((response) => {
      switch (args[0]) {
        case "bm":
        case "beatmap": {
          axios({
            method: "get",
            url: `https://osu.ppy.sh/api/v2/beatmaps/${args[1]}`,
            headers: {
              Authorization: `Bearer ${response.data.access_token}`,
            },
          }).then((res) => {
            console.log(res.data);
          });
          break;
        }
        case "profile":
        case "u":
        case "usr":
        case "user": {
          args.shift();
          axios({
            method: "get",
            url: `https://osu.ppy.sh/api/v2/users/${args.join(" ")}/osu`,
            headers: {
              Authorization: `Bearer ${response.data.access_token}`,
            },
          })
            .then((res) => {
              res = res.data;
              // gets all info into specific variables
              const { country_code, avatar_url, username, id, is_supporter } =
                res;
              //const rank_history = res.rank_history.data;
              const level = res.statistics.level.current;
              const level_progress = res.statistics.level.progress;
              const acc = res.statistics.hit_accuracy;
              const plays = res.statistics.play_count;
              const max_combo = res.statistics.maximum_combo;
              const rank = res.statistics.global_rank;
              const { country_rank } = res.statistics;
              const { play_time, pp } = res.statistics;
              const { a, s, sh, ss, ssh } = res.statistics.grade_counts;

              let desc = ""
              desc += ":flag_" + country_code.toLowerCase() + ": " + require("../../data/countries.json")[country_code.toUpperCase()] + "⠀";
              if (is_supporter) desc += "<:supporter:889183831138111509> osu!supporter⠀";
              const time = new Date(play_time * 1000).toISOString().substr(11, 8);
              //const rx = /(?<=(:\d\d){2}).*/gm.exec(time)[1].replace(/:/gm, "'") + "\"";
              //const match = /(?<=(:\d\d){2}).*/gm.exec(time)[1]
              //console.log(match);
              //desc += time.replace(match, rx)
              desc += ":stopwatch: " + time

              const f1 =
                `<:arrowwhite:889175332291239967> __Rang__` + "\n" +
                `\n<:arrowwhite:889175332291239967> __Perf__` +
                `\n<:arrowwhite:889175332291239967> __Accu__` +
                `\n<:arrowwhite:889175332291239967> __Niveau__` +
                `\n<:arrowwhite:889175332291239967> __Parties__` +
                `\n<:arrowwhite:889175332291239967> __Combo__`;

              const f2 =
                `*Monde*: **#${rank}**` +
                `\n*${country_code.toUpperCase()}*: #${country_rank}` +
                `\n**${pp}** PP` +
                `\n**${acc}**%` +
                `\n**${level}**⠀(*${level_progress}*%)` +
                `\n*${plays}* au total` +
                `\nx*${max_combo}* max`

              const f3 =
                "__**Scores**__ :\n" +
                `\n<:rankingXH:889200632186146866> ${ssh}` +
                `\n<:rankingX:889200601907490896> ${ss}` +
                `\n<:rankingSH:889200561197551646> ${sh}` +
                `\n<:rankingS:889200534685364238> ${s}` +
                `\n<:rankingA:889200648946593793> ${a}`

              const emb = new MessageEmbed()
                .setTitle(username)
                .setThumbnail(avatar_url)
                .setDescription(desc)
                .addField("⠀", f1, true)
                .addField("⠀", f2, true)
                .addField("⠀", f3, true)
                .setURL("https://osu.ppy.sh/users/" + id)

              msg.reply({ embeds: [emb] });
              // clears some memory
            })
            .catch((err) => {
              if (err.code === 404 || err.message === "Request failed with status code 404") {
                return msg.reply("Utilisateur inconnu");
              } else {
                return msg.reply(
                  "Problème lors de l'éxécution de la commande :-/\n" + err
                );
              }
            });
          break;
        }
        default: {
          msg.reply(
            `Paramètre inconnu: \`${args[0]}\`\nUtilisez \`user\` ou \`bm\``
          );
        }
      }
    })
    .catch((err) => {
      msg.reply("Erreur en éxécutant la commande :-/\n`" + err + "`");
    });
};
