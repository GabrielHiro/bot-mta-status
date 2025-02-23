const gamedig = require("gamedig");
const {
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const SERVER_STATUS_ONLINE = '```diff\n+[🟢 Online]\n```';
const SERVER_STATUS_OFFLINE = '```[🔴 Offline]```';
const FOOTER_TEXT = "Sistema AutoConnect - HiroFKW";
const FOOTER_ICON_URL = "https://imgur.com/oHouJ74";
const BUTTON_LABEL = 'Servidor HiroFKW';
const BUTTON_URL = 'https://discord.gg/';
const CHANNEL_ID = "1004537410685767781";

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client, config) {

    
    console.log("\n");
    console.log('\x1b[37m%s\x1b[0m', `                               > Estou online em ${client.user.username} <`);
    console.log('\x1b[37m%s\x1b[0m', `                                > Estou em ${client.guilds.cache.size}, Servidores <`);
    console.log('\x1b[37m%s\x1b[0m', `                                 > Tenho ${client.users.cache.size} usuários <`);
    console.log('\x1b[37m%s\x1b[0m', `1.0.0`);

    const server = config.server;

    // Function to update the embed with the server status
    async function updateEmbed() {
      try {
        const mtasa = await gamedig.query({
          type: "mtasa",
          host: server.ip,
          port: server.port,
          socketTimeout: 5000, // 5000 ms (5 seconds)
        });

        // Create the embed with server information
        const embed = new EmbedBuilder()
          .setColor("#6f00ff")
          .setTitle(`${mtasa.name}`)
          .addFields(
            { 
              name: "IP do servidor", 
              value: `\`\`\`ini\nconnect ${mtasa.connect}\n\`\`\``, 
              inline: false 
            },        
            { 
              name: "Jogadores online", 
              value: `\`\`\`ini\n[ ${mtasa.raw.numplayers} / ${mtasa.maxplayers} ]\n\`\`\``, 
              inline: true 
            }, 
            { 
              name: "Status do servidor", 
              value: mtasa.raw.numplayers > 0 ? SERVER_STATUS_ONLINE : SERVER_STATUS_OFFLINE, 
              inline: true 
            },
            { 
              name: "Como entrar?", 
              value: '```1. Abra FiveM \n2. Pressione F8 no seu teclado. \n3. Cole "connect "\n4. Você já pode entrar!```', 
              inline: false 
            }
          )
          .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON_URL })
          .setTimestamp();

        // Create the button
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel(BUTTON_LABEL)
              .setURL(BUTTON_URL)
              .setStyle(ButtonStyle.Link)
          );

        const channel = client.channels.cache.get(CHANNEL_ID);
        const messageId = config.messageId;

        // Try to edit the existing message, if not exist, create a new one
        try {
          const message = await channel.messages.fetch(messageId);
          await message.edit({ embeds: [embed], components: [row] });
        } catch (error) {
          const sentMessage = await channel.send({ embeds: [embed], components: [row] });
          config.messageId = sentMessage.id; // Save the new message ID if the previous one is not found
        }

      } catch (error) {
        console.error("[Erro] Não foi possível obter o status do servidor:", error);
      }
    }

    // Initial call
    updateEmbed();

    // Update at the defined interval
    setInterval(updateEmbed, config.duration);
  },
};
