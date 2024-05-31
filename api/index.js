const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/connectDB')
const cloudinary = require('cloudinary').v2;
const router = require("./routes/routes")

dotenv.config();

const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/test', (req, res) => {
    res.json('test ok');
});
app.use("/api", router)

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log("Server running at http://localhost:" + PORT);
    });
})


// const wss = new ws.WebSocketServer({ server });
// wss.on('connection', (connection, req) => {

//     function notifyAboutOnlinePeople() {
//         [...wss.clients].forEach(client => {
//             client.send(JSON.stringify({
//                 online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username })),
//             }));
//         });
//     }

//     connection.isAlive = true;

//     connection.timer = setInterval(() => {
//         connection.ping();
//         connection.deathTimer = setTimeout(() => {
//             connection.isAlive = false;
//             clearInterval(connection.timer);
//             connection.terminate();
//             notifyAboutOnlinePeople();
//         }, 1000);
//     }, 5000);

//     connection.on('pong', () => {
//         clearTimeout(connection.deathTimer);
//     });

//     // read username and id form the cookie for this connection
//     const cookies = req.headers.cookie;
//     if (cookies) {
//         const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
//         if (tokenCookieString) {
//             const token = tokenCookieString.split('=')[1];
//             if (token) {
//                 jwt.verify(token, jwtSecret, {}, (err, userData) => {
//                     if (err) throw err;
//                     const { userId, username } = userData;
//                     connection.userId = userId;
//                     connection.username = username;
//                 });
//             }
//         }
//     }

//     connection.on('message', async (message) => {
//         const messageData = JSON.parse(message.toString());
//         const { recipient, text, file } = messageData;
//         let filename = null;

//         if (file) {
//             const parts = file.name.split('.');
//             const ext = parts[parts.length - 1];
//             filename = Date.now() + '.' + ext;
//             const path = __dirname + '/uploads/' + filename;
//             const bufferData = new Buffer.from(file.data.split(',')[1], 'base64');
//             fs.writeFile(path, bufferData, () => {
//                 console.log('file saved:' + path);
//             });
//         }

//         if (recipient && (text || file)) {
//             const messageDoc = await Message.create({
//                 sender: connection.userId,
//                 recipient: recipient,
//                 text,
//                 file: file ? filename : null,
//             });

//             [...wss.clients]
//                 .filter(c => c.userId === recipient)
//                 .forEach(c => c.send(JSON.stringify({
//                     text,
//                     sender: connection.userId,
//                     recipient,
//                     file: file ? filename : null,
//                     _id: messageDoc._id,
//                 })));
//         }
//     });

//     // notify everyone about online people (when someone connects)
//     notifyAboutOnlinePeople();
// });