const gamedig = require("gamedig");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "jogadores",
  description: "Jogadores ativos no servidor.",
  options: [],

  async execute(client, interaction, config, db) {
    await interaction.deferReply();

    const { user, options } = interaction;
    const server = config.server;

    const players = [];

    // Consulta o servidor MTA:SA para obter informações dos jogadores
    const mtasa = await gamedig.query({
      type: "mtasa",
      host: server.ip,
      port: server.port,
    });

    // Adiciona os jogadores à lista com formatação específica
    for (const i in mtasa.players) {
      players.push(
        `:woman_curly_haired::skin-tone-1: **|** \`${mtasa.players[i].name}\` **|** **${mtasa.players[i].raw.ping}ms**`
      );
    }

    let max = 25;
    let min = 0;

    const a = players.slice(min, max);
    const v1 = a.join("\n");

    // Cria o embed com a lista de jogadores
    const embed = new EmbedBuilder()
      .setColor(config.color || 777)
      .setAuthor({ name: `${mtasa.name}` })
      .setDescription(v1)
      .setTimestamp()
      .setFooter({
        text: `Solicitado por ${user.tag}.`,
        iconURL: `${user.displayAvatarURL()} `,
      });

    // Cria a linha de botões para navegação
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("anterior")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("pagina")
        .setLabel(`${min}/${max}`)
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("proximo")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Secondary)
    );

    const int = await interaction.followUp({
      embeds: [embed],
      components: [row],
    });

    const filter = (i) => i.user.id === user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "proximo") {
        max += 25;
        min += 25;

        const novoMax = max;
        const novoMin = min;

        const a = players.slice(novoMin, novoMax);
        const v1 = a.join("\n");

        const embed = new EmbedBuilder()
          .setColor(config.color || 777)
          .setAuthor({ name: `${mtasa.name}` })
          .setDescription(v1)
          .setTimestamp()
          .setFooter({
            text: `Solicitado por ${user.tag}.`,
            iconURL: `${user.displayAvatarURL()} `,
          });

        if (novoMax >= mtasa.raw.numplayers) {
          const rowa = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("anterior")
              .setEmoji("⬅️")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("pagina")
              .setLabel(`${novoMin}/${novoMax}`)
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setDisabled(true)
              .setCustomId("proximo")
              .setEmoji("➡️")
              .setStyle(ButtonStyle.Secondary)
          );

          return i.update({ embeds: [embed], components: [rowa] });
        } else {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("anterior")
              .setEmoji("⬅️")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("pagina")
              .setLabel(`${novoMin}/${novoMax}`)
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("proximo")
              .setEmoji("➡️")
              .setStyle(ButtonStyle.Secondary)
          );

          return i.update({ embeds: [embed], components: [row] });
        }
      }

      if (i.customId === "anterior") {
        max -= 25;
        min -= 25;

        const novoMax = max;
        const novoMin = min;

        const a = players.slice(novoMin, novoMax);
        const v1 = a.join("\n");

        const embed = new EmbedBuilder()
          .setColor(config.color || 777)
          .setAuthor({ name: `${mtasa.name}` })
          .setDescription(v1)
          .setTimestamp()
          .setFooter({
            text: `Solicitado por ${user.tag}.`,
            iconURL: `${user.displayAvatarURL()} `,
          });

        if (novoMax === 25) {
          const rowa = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("anterior")
              .setDisabled(true)
              .setEmoji("⬅️")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("pagina")
              .setLabel(`${novoMin}/${novoMax}`)
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setDisabled(false)
              .setCustomId("proximo")
              .setEmoji("➡️")
              .setStyle(ButtonStyle.Secondary)
          );

          return i.update({ embeds: [embed], components: [rowa] });
        } else {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("anterior")
              .setEmoji("⬅️")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("pagina")
              .setLabel(`${novoMin}/${novoMax}`)
              .setDisabled(true)
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("proximo")
              .setEmoji("➡️")
              .setStyle(ButtonStyle.Secondary)
          );

          return i.update({ embeds: [embed], components: [row] });
        }
      }
    });
  },
};
