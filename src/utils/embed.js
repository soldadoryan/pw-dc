import { EmbedBuilder } from "discord.js";

export const createEmbed = () => {
  return new EmbedBuilder()
    .setColor(0x0000ff)
    .setThumbnail(process.env.THUMB_URL)
    .setTimestamp()
    .setFooter({
      text: "Desenvolvido por AN4LOG",
    });
};
