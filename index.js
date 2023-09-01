const express = require("express");
const connectToMongo = require('./models/conn');
const app = express();
const PORT = 8000 || process.env.PORT;

connectToMongo();
app.use(express.json());

//available routes
app.use("/api/auth", require('./routes/auth'))
app.use("/api/posts", require('./routes/posts'))
app.use("/api/profiles", require('./routes/profiles'))

app.get("/", (req, res) => {
    res.send("Smart Bolg Application");
})

app.listen(PORT, (req, res) => {
    console.log(`server is running on port number ${PORT}`)
})