// src/commands/haha/index.js
import { SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('haha')
    .setDescription('Haha command!'),
};

export const action = async (interaction) => {
  await interaction.reply('Haha!');
};