// src/core/loader.js
import { REST, Routes, Collection } from 'discord.js';
import fg from 'fast-glob';
import { useAppStore } from '@/store/app';

const updateSlashCommands = async (commands) => {
  const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);
  const result = await rest.put(
    Routes.applicationGuildCommands(
      process.env.APPLICATION_ID,
      '1232567757996818483' // 替換為你的 Guild ID
    ),
    {
      body: commands.map((cmd) => cmd.data.toJSON()), // 使用 .data.toJSON()
    }
  );
  console.log(result);
};

export const loadCommands = async () => {
  const appStore = useAppStore();
  const commands = [];
  const actions = new Collection();

  const files = await fg('./src/commands/**/index.js');

  for (const file of files) {
    const cmd = await import(file);
    if (cmd.command && cmd.command.data) {
      commands.push(cmd.command);
      actions.set(cmd.command.data.name, cmd.action);
    } else {
      console.error(`Invalid command file:`, file);
    }
  }

  await updateSlashCommands(commands);
  appStore.commandsActionMap = actions;

  console.log(appStore.commandsActionMap);
};

export const loadEvents = async () => {
  const appStore = useAppStore();
  const client = appStore.client;
  const files = await fg('./src/events/**/index.js');

  for (const file of files) {
    const eventFile = await import(file);
    if (eventFile.event && eventFile.action) {
      if (eventFile.event.once) {
        client.once(eventFile.event.name, eventFile.action);
      } else {
        client.on(eventFile.event.name, eventFile.action);
      }
    } else {
      console.error(`Invalid event file:`, file);
    }
  }
};
