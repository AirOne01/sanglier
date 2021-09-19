////////////////////////////////
//
// Note: app might get randomly 439'd
// during worktime. Probably due to
// https://github.com/CarlosEsco/Neko/issues/288
// No fix to do, just a random issue.
//
////////////////////////////////

const axios = require("axios").default;
const Distance = require("damerau-levenshtein");
const { MessageAttachment, MessageEmbed } = require("discord.js");

function reloadToken(client) {
  return axios.post("https://api.mangadex.org/auth/login", {
    username: client.config.MDUser,
    password: client.config.MDPwd,
  });
}

exports.run = (client, msg, args) => {
  msg.channel.sendTyping();

  reloadToken(client)
    .then((res) => {
      const token = res.token;

      if (["list", "l", "titles", "t", "mangas"].includes(args[0])) {
        // getting a list of mangas
        args.shift();
        axios
          .get(`https://api.mangadex.org/manga?title=${args.join(" ")}`)
          .then((res) => {
            let embeds = new MessageEmbed();
            res.data.data.forEach((manga) => {
              let desc = manga.attributes.description.en
                .replace(/(?<=^.{200}).*|^---$|^(\r\n|\n|\r)/gms, "")
                .replace(/\r\n|\n|\r/gm, " ");
              // this is for cleaning de desc and keeping only the first 200 characters. And also we remove useless newlines. RegEx is amazing.
              if (desc.length > 99) desc += "...";
              embeds.addField(manga.attributes.title.en, desc + ` \[[+](https://mangadex.org/title/${manga.id})]`);
            });
            msg.reply({ embeds: [embeds] });
          })
          .catch((err) => {
            msg.reply(err.toString());
          });
      } else {
        // getting info on a specific manga
        (async () => {
          axios
            .get(`https://api.mangadex.org/manga?title=${args.join(" ")}`)
            .then(async (res) => {
              let manga = { similarity: 0.0 };
              res.data.data.forEach((m) => {
                const similarity = Distance(
                  args.join(" "),
                  m.attributes.title.en
                ).similarity;
                if (similarity > manga.similarity) {
                  manga.m = m;
                  manga.MDid = m.id;
                  manga.similarity = similarity;
                  manga.title = m.attributes.title.en;
                  manga.description = m.attributes.description.en.replace(
                    /^---$|^(\r\n|\n|\r)/gm,
                    ""
                  ); // regex is for cleaning
                }
              });
              if (manga.hasOwnProperty("title")) {
                let tags = "";
                manga.m.attributes.tags.forEach(tag => {
                  if (tags === "") {
                    tags += tag.attributes.name.en;
                  } else {
                    tags += ", " + tag.attributes.name.en;
                  }
                })

                const embed = new MessageEmbed()
                  .setTitle(manga.title)
                  .setThumbnail("https://i.imgur.com/8Ks8h2C.png")
                  .setURL(`https://mangadex.org/title/${manga.MDid}`)
                  .setFooter("Chargement de la couverture...", "https://i.imgur.com/QWh34Ta.gif")
                  .addField("Type", manga.m.attributes.publicationDemographic + ', ' + manga.m.attributes.contentRating)
                  .addField("Synopsis", manga.description)
                  .addField("Chapitres", `Vol. ${manga.m.attributes.lastVolume} chap. ${manga.m.attributes.lastChapter}`)
                  .addField("Tags", tags)

                msg.reply({ embeds: [embed] }).then(async (msg) => {
                  const page = await client.browser.newPage();
                  await page.goto(`https://mangadex.org/title/${manga.MDid}`, {
                    waitUntil: "networkidle0",
                  });

                  const cover = await page.evaluate(() => {
                    return document.getElementsByClassName(
                      "rounded shadow-md w-full max-h-full h-auto"
                    )[0].src;
                  });

                  const embed = msg.embeds[0]
                    .setImage(cover)
                    .setFooter("");
                  msg.edit({embeds: [embed]});
                });
              } else {
                msg.reply({
                  embeds: [
                    {
                      title: "Rien trouvé dsl.",
                      description:
                        "Essaie avec un titre plus clair, ou le tittre anglais <:sad_doge:888910027446956063>",
                    },
                  ],
                });
              }
            })
            .catch((err) => {
              msg.reply(err.toString());
            });
        })();
      }
    })
    .catch((err) => {
      msg.reply(err.toString());
    });
};
