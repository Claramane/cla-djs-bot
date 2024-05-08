// src/events/interactionCreate/index.js
import { Events } from 'discord.js';
import { useAppStore } from '@/store/app';

export const event = {
  name: Events.InteractionCreate,
  once: false,
};

export const action = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const appStore = useAppStore();
  const commandAction = appStore.commandsActionMap.get(interaction.commandName);
  if (commandAction) {
    await commandAction(interaction);
  } else {
    console.error(`No action found for command: ${interaction.commandName}`);
    await interaction.reply({
      content: `Command not found: ${interaction.commandName}`,
      ephemeral: true,
    });
  }
};
