# BOT Status para Servidores MTA/SAMP

Um projeto de bot de Discord de código aberto feito para servidores [MTA](https://multitheftauto.com/)/[SAMP](https://www.sa-mp.mp/).

Este projeto é uma continuação de um repositório anterior que foi perdido. Agradecimentos especiais a Erick Yamato, que contribuiu significativamente para a construção deste projeto em 2018, dentro do contexto dos servidores de SAMP e FIVEM.

## Instalação ✔

1. Clone o repositório:
   ```sh 
   git clone https://github.com/GabrielHiro/bot-mta-status.git
   cd bot-mta-status
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Preencha corretamente os campos no arquivo [config.json]().

4. Inicie o bot:
   ```sh
   npm run start
   ```

## Configuração ⚙

Edite o arquivo config.json com as informações do seu servidor e token do bot:
```json
{
  "token": "<TOKEN-DO-BOT>", 
  "server": {
    "ip": "51.81.48.91", 
    "port": "22003" 
  },
  "color": "#6f00ff", 
  "duration": 120000 
}
```

## Aviso ⚠

O projeto não funcionará se o seu servidor MTA não estiver em execução.

## Capturas de Tela 📷

![Screenshot 1](224495541-66f3b4bd-7827-4601-8c18-6bbf6518e64a.png)
![Screenshot 2](224495543-cb6cc59e-8311-4dc5-a922-a42113f35261.png)