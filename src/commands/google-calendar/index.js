// src/commands/google-calendar/index.js
import { SlashCommandBuilder } from 'discord.js';
import { authorize, listEvents } from '@/services/googleCalendar';

export const command = {
  data: new SlashCommandBuilder()
    .setName('gcal-events')
    .setDescription('列出 Google Calendar 事件'),
};

export const action = async (interaction) => {
  await interaction.deferReply();
  authorize(async (auth) => {
    try {
      const events = await listEvents(auth);
      const eventList = events.map((event) => {
        const start = event.start.dateTime || event.start.date;
        return `${start} - ${event.summary}`;
      }).join('\n') || '沒有即將到來的事件。';
      await interaction.editReply(`近期事件：\n${eventList}`);
    } catch (error) {
      await interaction.editReply(`無法取得事件：${error}`);
    }
  });
};
