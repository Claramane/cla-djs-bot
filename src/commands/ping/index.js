// src/commands/ping/index.js
import { SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping command!'),
};

export const action = async (interaction) => {
  await interaction.reply('Pong!');
};