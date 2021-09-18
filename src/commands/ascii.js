const axios = require("axios").default;
const fs = require("fs");
const { MessageAttachment } = require("discord.js");

// gets fonts list
let fonts =
  "3-d\n3x5\n5lineoblique\n1943____\n4x4_offr\n64f1____\na_zooloo\nadvenger\naquaplan\nasc_____\nascii___\nassalt_m\nasslt__m\natc_____\natc_gran\nb_m__200\nbattle_s\nbattlesh\nbaz__bil\nbeer_pub\nbubble__\nbubble_b\nc1______\nc2______\nc_ascii_\nc_consen\ncaus_in_\nchar1___\nchar2___\nchar3___\nchar4___\ncharact1\ncharact2\ncharact3\ncharact4\ncharact5\ncharact6\ncharacte\ncharset_\ncoil_cop\ncom_sen_\ncomputer\nconvoy__\nd_dragon\ndcs_bfmo\ndeep_str\ndemo_1__\ndemo_2__\ndemo_m__\ndevilish\ndruid___\ne__fist_\nebbs_1__\nebbs_2__\neca_____\netcrvs__\nf15_____\nfaces_of\nfair_mea\nfairligh\nfantasy_\nfbr12___\nfbr1____\nfbr2____\nfbr_stri\nfbr_tilt\nfinalass\nfireing_\nflyn_sh\nfp1_____\nfp2_____\nfunky_dr\nfuture_1\nfuture_2\nfuture_3\nfuture_4\nfuture_5\nfuture_6\nfuture_7\nfuture_8\ngauntlet\nghost_bo\ngothic\ngothic__\ngrand_pr\ngreen_be\nhades___\nheavy_me\nheroboti\nhigh_noo\nhills___\nhome_pak\nhouse_of\nhypa_bal\nhyper___\ninc_raw_\nitalics_\njoust___\nkgames_i\nkik_star\nkrak_out\nlazy_jon\nletter_w\nletterw3\nlexible_\nmad_nurs\nmagic_ma\nmaster_o\nmayhem_d\nmcg_____\nmig_ally\nmodern__\nnew_asci\nnfi1____\nnotie_ca\nnpn_____\nodel_lak\nok_beer_\noutrun__\np_s_h_m_\np_skateb\npacos_pe\npanther_\npawn_ins\nphonix__\nplatoon2\nplatoon_\npod_____\nr2-d2___\nrad_____\nrad_phan\nradical_\nrainbow_\nrally_s2\nrally_sp\nrampage_\nrastan__\nraw_recu\nrci_____\nripper!_\nroad_rai\nrockbox_\nrok_____\nroman\nroman___\nscript__\nskate_ro\nskateord\nskateroc\nsketch_s\nsm______\nspace_op\nspc_demo\nstar_war\nstealth_\nstencil1\nstencil2\nstreet_s\nsubteran\nsuper_te\nt__of_ap\ntav1____\ntaxi____\ntec1____\ntec_7000\ntecrvs__\nti_pan__\ntimesofl\ntomahawk\ntop_duck\ntrashman\ntriad_st\nts1_____\ntsm_____\ntsn_base\ntwin_cob\ntype_set\nucf_fan_\nugalympi\nunarmed_\nusa_____\nusa_pq__\nvortron_\nwar_of_w\nyie-ar__\nyie_ar_k\nz-pilot_\nzig_zag_\nzone7___\nacrobatic\nalligator\nalligator2\nalphabet\navatar\nbanner\nbanner3-D\nbanner3\nbanner4\nbarbwire\nbasic\n5x7\n5x8\n6x10\n6x9\nbrite\nbriteb\nbritebi\nbritei\nchartr\nchartri\nclb6x10\nclb8x10\nclb8x8\ncli8x8\nclr4x6\nclr5x10\nclr5x6\nclr5x8\nclr6x10\nclr6x6\nclr6x8\nclr7x10\nclr7x8\nclr8x10\nclr8x8\ncour\ncourb\ncourbi\ncouri\nhelv\nhelvb\nhelvbi\nhelvi\nsans\nsansb\nsansbi\nsansi\nsbook\nsbookb\nsbookbi\nsbooki\ntimes\ntty\nttyb\nutopia\nutopiab\nutopiabi\nutopiai\nxbrite\nxbriteb\nxbritebi\nxbritei\nxchartr\nxchartri\nxcour\nxcourb\nxcourbi\nxcouri\nxhelv\nxhelvb\nxhelvbi\nxhelvi\nxsans\nxsansb\nxsansbi\nxsansi\nxsbook\nxsbookb\nxsbookbi\nxsbooki\nxtimes\nxtty\nxttyb\nbell\nbig\nbigchief\nbinary\nblock\nbroadway\nbubble\nbulbhead\ncalgphy2\ncaligraphy\ncatwalk\nchunky\ncoinstak\ncolossal\ncontessa\ncontrast\ncosmic\ncosmike\ncrawford\ncricket\ncursive\ncyberlarge\ncybermedium\ncybersmall\ndecimal\ndiamond\ndigital\ndoh\ndoom\ndotmatrix\ndouble\ndrpepper\ndwhistled\neftichess\neftifont\neftipiti\neftirobot\neftitalic\neftiwall\neftiwater\nepic\nfender\nfourtops\nfraktur\ngoofy\ngraceful\ngradient\ngraffiti\nhex\nhollywood\ninvita\nisometric1\nisometric2\nisometric3\nisometric4\nitalic\nivrit\njazmine\njerusalem\nkatakana\nkban\nl4me\nlarry3d\nlcd\nlean\nletters\nlinux\nlockergnome\nmadrid\nmarquee\nmaxfour\nmike\nmini\nmirror\nmnemonic\nmorse\nmoscow\nmshebrew210\nnancyj-fancy\nnancyj-underlined\nnancyj\nnipples\nntgreek\nnvscript\no8\noctal\nogre\nos2\npawp\npeaks\npebbles\npepper\npoison\npuffy\npyramid\nrectangles\nrelief\nrelief2\nrev\nrot13\nrounded\nrowancap\nrozzo\nrunic\nrunyc\nsblood\nscript\nserifcap\nshadow\nshort\nslant\nslide\nslscript\nsmall\nsmisome1\nsmkeyboard\nsmscript\nsmshadow\nsmslant\nsmtengwar\nspeed\nstacey\nstampatello\nstandard\nstarwars\nstellar\nstop\nstraight\ntanja\ntengwar\nterm\nthick\nthin\nthreepoint\nticks\nticksslant\ntinker-toy\ntombstone\ntrek\ntsalagi\ntwopoint\nunivers\nusaflag\nweird\nwhimsy";
axios.get("https://artii.herokuapp.com/fonts_list").then((res) => {
  fonts = res.data;
});

exports.run = (client, msg, args) => {
  if (args.length === 1 && (["fonts","font"].includes(args[0]))) {
    // if asking for font list
    msg.reply({
      files: [
        new MessageAttachment(Buffer.from(fonts, "utf8"), "ascii fonts.txt"),
      ],
    });
  } else if (args.length > 1 && fonts.split("\n").includes(args[0].toLowerCase())) {
    // if using a specific font
    const font = args[0];
    args.shift();

    axios
      .get(
        `https://artii.herokuapp.com/make?text=${args.join(" ")}&font=${font.toLowerCase()}`
      )
      .then((res) => {
        msg.reply({
          files: [new MessageAttachment(Buffer.from(res.data, "utf8"), "message.txt")],
        });
      });
  } else if (args.length === 1) {
    // if no precise font
    axios
      .get(
        `https://artii.herokuapp.com/make?text=${args.join(" ")}`
      )
      .then((res) => {
        msg.reply({
          files: [new MessageAttachment(Buffer.from(res.data, "utf8"), "message.txt")],
        });
      });
  } else {
    msg.reply(`Utilisation: \`${client.config.prefix}aa [police] <texte>\` ou \`${client.config.prefix}aa <texte>\`.\nUtilise \`${client.config.prefix}aa fonts\` pour la liste des polices supportées`);
  }
};
