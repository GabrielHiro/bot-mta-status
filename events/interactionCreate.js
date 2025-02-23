const {
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const fs = require("fs");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  name: Events.InteractionCreate,
  once: false,

  /**
   * Função executada quando uma interação é criada.
   * @param {Client} client - O cliente do bot do Discord.
   * @param {Object} config - As configurações do bot.
   * @param {Interaction} interaction - A interação criada.
   */
  async execute(client, config, interaction) {
    const { user, channel, guild } = interaction;

    // Verifica se a interação é um comando de chat
    if (interaction.isChatInputCommand()) {
      // Verifica se a interação ocorreu em um servidor
      if (!interaction.guild) return;

      // Itera sobre os arquivos de comandos
      for (let props of fs.readdirSync("./commands")) {
        const command = require(`../commands/${props}`);

        // Verifica se o nome do comando corresponde ao comando da interação
        if (
          interaction.commandName.toLowerCase() === command.name.toLowerCase()
        ) {
          // Executa o comando correspondente
          return command.execute(client, interaction, config);
        }
      }
    }
  },
};
