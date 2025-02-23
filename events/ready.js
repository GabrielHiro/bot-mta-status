const gamedig = require("gamedig");
const {
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client, config) {
    console.log(`[BOT] ${client.user.tag} está activo.`);

    const server = config.server;

    async function updateEmbed() {
      try {
        const mtasa = await gamedig.query({
          type: "mtasa",
          host: server.ip,
          port: server.port,
          socketTimeout: 5000, // 5000 ms (5 segundos)
        });
        const embed = new EmbedBuilder()
        .setColor("#6f00ff")
        .setTitle(`${mtasa.name}`)
        .addFields(
          { 
            name: "IP del servidor", 
            value: `\`\`\`ini\nconnect ${mtasa.connect}\n\`\`\``, 
            inline: false 
        },        
        { name: "Jugadores online", 
          value: `\`\`\`ini\n[ ${mtasa.raw.numplayers} / ${mtasa.maxplayers} ]\n\`\`\``, 
          inline: true
        }, 
        { name: "Estado del servidor", 
          value: mtasa.raw.numplayers > 0 ? '```diff\n+[🟢 Online]\n```' : "```[🔴 Offline]```", 
          inline: true 
        },
        { name: "¿Como entrar?", 
          value: '```1. Abre FiveM \n2. Toca F8 en tu teclado. \n3. Pega "connect 45.89.30.242:30120"\n4. ¡Ya puedes entrar!```', 
          inline: false 
        }
        )
        .setFooter({ text: "Sistema AutoConnect - Rolas V1", iconURL: "https://imgur.com/eaoPB0S.png" })
        .setTimestamp();

        // Aquí agregamos el botón
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
        .setLabel('Servidor Rolas')
        .setURL('https://discord.gg/4e9QUvZ7xP')
        .setStyle(ButtonStyle.Link)
          );


        const channel = client.channels.cache.get("1004537410685767781");
        const messageId = config.messageId;

        // Intentar editar el mensaje existente, si no existe, crear uno nuevo
        try {
          const message = await channel.messages.fetch(messageId);
          message.edit({ embeds: [embed], components: [row] }); // Agregar el botón al mensaje
        } catch (error) {
          const sentMessage = await channel.send({ embeds: [embed], components: [row] }); // Agregar el botón al mensaje nuevo
          config.messageId = sentMessage.id; // Guardar el nuevo ID del mensaje si no se puede encontrar uno previo
        }

      } catch (error) {
        console.error("[Error] No se pudo obtener el estado del servidor:", error);
      }
    }

    // Llamada inicial
    updateEmbed();

    // Actualizar cada cierto tiempo
    setInterval(updateEmbed, config.duration);
  },
};
