const axios = require("axios");
const Chart = require("chart.js").Chart;
const fs = require("fs");
const path = require("path");

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
              const rank_history = res.rank_history.data;
              const level = res.statistics.level.current;
              const level_progress = res.statistics.level.current;
              const acc = res.statistics.hit_accuracy;
              const plays = res.statistics.play_count;
              const max_combo = res.statistics.maximum_combo;
              const rank = res.statistics.global_rank;
              const { country_rank } = res.statistics;
              const { play_time, pp } = res.statistics;

              (async (data) => {
                const page = await client.browser.newPage();

                await page.goto(
                  `file:///${path.join(
                    __dirname,
                    "../web/osuUserProfile.html"
                  )}`
                );
                await page.evaluate((data) => {
                  let labels = "";
                  for (let i = 0; i < data.length; i++) {
                    labels += ' ';
                  };
                  
                  return;
                  const ctx = document
                    .getElementById("rankChart")
                    .getContext("2d");
                  const chart = new Chart(ctx, {
                    type: "line",
                    data: {
                      labels: labels,
                      datasets: [
                        {
                          data: data,
                          label: "Asia",
                          borderColor: "#8e5ea2",
                          fill: false,
                          tension: 0.3,
                        },
                      ],
                      options: {
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                reverse: true,
                              },
                            },
                          ],
                        },
                      },
                    },
                  });
                },{data});
                const image = await page.screenshot({
                  type: "jpeg",
                  quality: 50,
                  omitBackground: true,
                  clip: {
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 600,
                  },
                });

                msg.reply({ files: [image] });
                await page.close();
                // clears some memory
              })(rank_history);
            })
            .catch((err) => {
              if (err.code === 404) {
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
