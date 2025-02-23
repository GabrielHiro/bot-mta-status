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
    console.log(`[BOT] ${client.user.tag} está ativo.`);

    const server = config.server;

    // Função para atualizar o embed com o status do servidor
    async function updateEmbed() {
      try {
        const mtasa = await gamedig.query({
          type: "mtasa",
          host: server.ip,
          port: server.port,
          socketTimeout: 5000, // 5000 ms (5 segundos)
        });

        // Criação do embed com as informações do servidor
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
              value: mtasa.raw.numplayers > 0 ? '```diff\n+[🟢 Online]\n```' : "```[🔴 Offline]```", 
              inline: true 
            },
            { 
              name: "Como entrar?", 
              value: '```1. Abra FiveM \n2. Pressione F8 no seu teclado. \n3. Cole "connect 45.89.30.242:30120"\n4. Você já pode entrar!```', 
              inline: false 
            }
          )
          .setFooter({ text: "Sistema AutoConnect - HiroFKW ", iconURL: "https://imgur.com/eaoPB0S.png" })
          .setTimestamp();

        // Criação do botão
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Servidor HiroFKW')
              .setURL('https://discord.gg/4e9QUvZ7xP')
              .setStyle(ButtonStyle.Link)
          );

        const channel = client.channels.cache.get("1004537410685767781");
        const messageId = config.messageId;

        // Tentar editar a mensagem existente, se não existir, criar uma nova
        try {
          const message = await channel.messages.fetch(messageId);
          await message.edit({ embeds: [embed], components: [row] }); // Adicionar o botão à mensagem
        } catch (error) {
          const sentMessage = await channel.send({ embeds: [embed], components: [row] }); // Adicionar o botão à nova mensagem
          config.messageId = sentMessage.id; // Salvar o novo ID da mensagem se não for possível encontrar um anterior
        }

      } catch (error) {
        console.error("[Erro] Não foi possível obter o status do servidor:", error);
      }
    }

    // Chamada inicial
    updateEmbed();

    // Atualizar a cada intervalo de tempo definido
    setInterval(updateEmbed, config.duration);
  },
};
