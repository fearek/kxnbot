module.exports = {
    name: "ping",
    category: "info",
    description: "Zwraca opóźnienie",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Ping....`);
        msg.edit(`🏓 Pong!
        Opóźnienie to: ${Math.round(msg.createdAt - message.createdAt)}ms
        Opóźnienie API to: ${Math.round(client.ping)}ms`);
    }
}
