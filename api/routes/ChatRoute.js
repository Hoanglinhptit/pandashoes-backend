module.exports = (app) => {
  const chatService = require("../services/ChatServices");
  app.route("/join-room").post(chatService.chatService);
};
