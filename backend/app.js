const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/place-routes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/places", placesRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500).json({ message: error.message || "An unknown error." });
});


mongoose
    .connect("mongodb+srv://username:password@cluster0.mb9mxkm.mongodb.net/myplaces?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        app.listen(5000);
    })
    .catch(error => {
        console.log(error);
    })