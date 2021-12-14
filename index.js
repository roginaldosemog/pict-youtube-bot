require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

app = express();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let chatIds = [];

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  chatIds.push(chatId);
  console.log(chatIds);

  const resp =
    "Bem vindo(a) ao bot de notificação de eventos da PIC Taguatinga!";

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

cron.schedule("* * * * *", () => {
  console.log("Executando a tarefa a cada 1 minuto");
  chatIds.forEach((id) => {
    console.log("Enviou mensagem para o chat: " + id);
    bot.sendMessage(id, "Executou uma tarefa");
  });
});

app.listen(1313);
