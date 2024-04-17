'use strict';
require('dotenv').config();
const OPENAI_TOKEN = process.env.OPENAI_API_KEY
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // For HTML
app.use(express.static(__dirname + '/public')); // For CSS and JS

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function(socket) {
    console.log('a user connected');
});

const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// Socket IO connection
io.on('connection', function(socket) {
    socket.on('chat message', async (text) => {
        try {
            // Get a reply from openAI
            const response = await openai.chat.completions.create({
                messages: [
                    {role: 'system', 'content': "You are friendly and fun."},
                    {role: 'user', content: text} 
                ],
                model: 'gpt-3.5-turbo', 
            });
            console.log(response);
            console.log(response.choices[0].message);
            // const aiText = response.data.choices[0][message][content]; 
            // socket.emit('bot reply', aiText); // Send the result back to the browser!
            const firstChoice = response.choices[0];
            if (firstChoice.message && firstChoice.message.content) {
                const aiText = firstChoice.message.content;
                socket.emit('bot reply', aiText); // Send the result back to the browser!
            } else {
                console.error('Missing or invalid message content in choices');
            }
        } catch (error) {
            console.log(error);
        }
    });   
});



