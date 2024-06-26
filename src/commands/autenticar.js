import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { createEmbed } from "../utils/embed";

const createNicknameModal = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("autenticar_nickname_modal")
    .setTitle(`[${process.env.ACRONYM_POLICE}] Autenticação`);

  const input = new TextInputBuilder()
    .setCustomId("autenticar_nickname_input")
    .setLabel("Qual o seu nickname?")
    .setStyle(TextInputStyle.Short);

  const actionRow = new ActionRowBuilder().addComponents(input);
  modal.addComponents(actionRow);

  await interaction.showModal(modal);
};

export const autenticar = async (interaction) => {
  await createNicknameModal(interaction);
};
