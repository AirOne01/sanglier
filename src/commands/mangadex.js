////////////////////////////////
//
// TODO: Add support for MD token, or else we get 429'd
// https://developer.mozilla.org/fr/docs/Web/HTTP/Status/429
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
        args.shift();
        axios
          .get(`https://api.mangadex.org/manga?title=${args.join(" ")}`)
          .then((res) => {
            let embeds = [];
            res.data.data.forEach((manga) => {
              let desc = manga.attributes.description.en
                .replace(/(?<=^.{200}).*|^---$|^(\r\n|\n|\r)/gms, "")
                .replace(/\r\n|\n|\r/gm, " ");
              // this is for cleaning de desc and keeping only the first 200 characters. And also we remove useless newlines. RegEx is amazing.
              if (desc.length > 99) desc += "...";
              embeds.push({
                title: manga.attributes.title.en,
                description: desc,
              });
            });
            msg.reply({ embeds: embeds });
          })
          .catch((err) => {
            msg.reply(err.toString());
          });
      } else {
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
                const page = await client.browser.newPage();
                console.log(`https://mangadex.org/title/${manga.MDid}`);
                await page.goto(`https://mangadex.org/title/${manga.MDid}`, {
                  waitUntil: "networkidle0",
                });

                const thumbnail = await page.evaluate(() => {
                  return document.getElementsByClassName(
                    "rounded shadow-md w-full max-h-full h-auto"
                  )[0].src;
                });
                const embed = new MessageEmbed()
                  .setTitle(manga.title)
                  .addField("Synopsis", manga.description)
                  .setImage(thumbnail)
                  .setThumbnail("https://i.imgur.com/8Ks8h2C.png")
                  .setURL(`https://mangadex.org/title/${manga.MDid}`);

                msg.reply({ embeds: [embed] });
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
