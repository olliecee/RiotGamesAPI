// Imports
import 'core-js';
import 'regenerator-runtime/runtime';
import express from 'express';
import cors, { corsPolicy } from './middlewares/cors'; // Custom middleware

import { getSummonerStats } from './controllers/LeagueOfLegends.controller';

// Declarations
const app = express();
const port = process.env.PORT;
const whitelist = ['localhost', 'localhost:3000', 'https://olliecee.com'];

// Middlewares
app.use(corsPolicy);
// app.use(cors({ whitelist }));

// Routes
app.get('/', (req, res) => res.send('Hello'));
app.get('/summoner/:summoner_name', getSummonerStats);

// Launching the service
app.listen(port, () => console.log(`Back end server listening on port ${port}!`));