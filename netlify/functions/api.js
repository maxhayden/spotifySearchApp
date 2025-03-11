import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const api = express();
const router = express.Router();
const clientID = process.env.ID;
const secretID = process.env.SECRET;

async function getSpotifyToken() {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientID,
                client_secret: secretID
            })
        });

        if (!response.ok) throw new Error("Failed to fetch Spotify token");

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}

router.get("/recommendation", async (req, res) => {

    //get API key
    try {
        const API_KEY = await getSpotifyToken();
        if (!API_KEY) {
            return res.status(500).json({ error: "Failed to retrieve Spotify token" });
        }

        //get artist searched for
        try {

            const artistString = req.query.artist;
            if (!artistString) return res.status(400).json({
                error: "artist is required"
            });

            artist = artistString.replace(/\s+/g, "");

            const response = await fetch(`https://api.spotify.com/v1/search?q=${artistString}&type=artist&limit=5&offset=0`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                return res.status(response.status).json({ error: API_KEY });
            }

            const data = await response.json();
            if (data.hasOwnProperty("error")) {
                return res.status(404).json({
                    error: data.error.message
                });
            }
             const artistData = data.artists.items;
            res.json({
                data: artistData
            });

        } catch (error) {
            res.status(500).json({ error: "Server error getting artist" });
        }

    } catch (error) {
        res.status(500).json({ error: "Server error getting key" });
    }


});
api.use("/api/", router);
export const handler = serverless(api);