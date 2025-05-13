import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

// Importando o express para criar um servidor HTTP
const expressApp = express();

// Criando o servidor HTTP com Express
const httpServer = createServer(expressApp);

// Criando a instância do Socket.IO com configuração de CORS
const socketServer = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Permitir acesso apenas da aplicação front-end
        methods: ["GET", "POST"],
    },
});

// Quando um cliente se conecta
socketServer.on("connection", (clientSocket) => {
    console.log("🔌 Novo usuário conectado:", clientSocket.id);

    // Quando o cliente se desconecta
    clientSocket.on("disconnect", (reason) => {
        console.log("❌ Usuário desconectado:", clientSocket.id);
    });

    // Quando o cliente envia seu nome de usuário
    clientSocket.on("set_username", (username) => {
        clientSocket.data.username = username; // Salvando no socket
    });

    // Quando o cliente envia uma mensagem
    clientSocket.on("message", (messageContent) => {
                // Emite a mensagem para todos os clientes
        socketServer.emit("receive_message", {
            ...messageContent,                      // Copia os dados da mensagem
            authorId: clientSocket.id,              // Adiciona o ID do autor
            authorName: clientSocket.data.username, // Adiciona o nome do autor
        });
    });
});

// Inicia o servidor na porta 3001
httpServer.listen(8080, () => {
    console.log("✔ Servidor WebSocket ativo em http://localhost:8080");
});