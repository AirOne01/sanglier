const axios = require('axios').default;

exports.run = (client, msg, args) => {
    // https://www.allkeyshop.com/api/v2/vaks.php?action=products&currency=eur&locales=fr_FR&productName=
    if (args.length === 0)
        return msg.reply(`Syntax: \`${client.config.prefix}gameprice <jeu>\``);

    (async () => {
        const page = client.browser.newPage();
        await page.goto("https://www.allkeyshop.com/blog/catalogue/search-" + args.join(" ") + "/");
        const results = 
    })();
}