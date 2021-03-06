import express from "express";
import gbService from "./gb-service.js";
import path from "path";
const app = express();

// Listen to the specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

app.get("/state", async (req, res) => {
  const responseContent = await gbService.getScreen();
  res.set("Cache-Control", "private, max-age=0, no-store");
  res.contentType("image/gif");
  res.send(responseContent);
});

app.get("/buttons/:button", (req, res) => {
  const button = req.params.button;
  const callback = req.query.callback;
  gbService.pressKey(button);

  if (callback) {
    res.redirect(callback);
  }
});
