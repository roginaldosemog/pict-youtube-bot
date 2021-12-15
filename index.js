require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

app = express();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let chatIds = []; // TODO: armazenar em um banco de dados

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  chatIds.push(chatId);
  console.log(chatIds);

  const resp = `
  *Seja bem vindo(a) ao bot da PIC Taguatinga*\n
Por aqui você poderá receber notificações sobre os eventos da PIC Taguatinga.\n
*_Comandos disponíveis:_*
/help - mostra os comandos disponíveis
/start - inicia o bot
/exit - deixa de receber mensagens do bot
  `;

  bot.sendMessage(chatId, resp, { parse_mode: "markdown" });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `
*Por aqui você poderá receber notificações sobre os eventos da PIC Taguatinga.*\n
*_Comandos disponíveis:_*
/help - mostra os comandos disponíveis
/start - inicia o bot
/exit - deixa de receber mensagens do bot
  `;

  bot.sendMessage(chatId, resp, { parse_mode: "markdown" });
});

bot.onText(/\/echo (.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp, { parse_mode: "markdown" });
});

bot.onText(/\/exit/, (msg) => {
  const chatId = msg.chat.id;

  var filtered = chatIds.filter((id) => id !== chatId);
  chatIds = filtered;

  const resp = `A partir de agora você não receberá mais as mensagens deste bot.`;

  bot.sendMessage(chatId, resp);
});

cron.schedule("* * * * *", () => {
  console.log("Executando a tarefa a cada 1 minuto");
  chatIds.forEach((id) => {
    console.log("Enviou mensagem para o chat: " + id);
    bot.sendMessage(
      id,
      `São ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  });
});

app.listen(process.env.PORT || 1313);
