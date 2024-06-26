import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { createEmbed } from "../utils/embed";

const generateMissionCode = () => {
  const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
  let resultado = "";
  const caracteresLength = caracteres.length;
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(
      Math.floor(Math.random() * caracteresLength)
    );
  }
  return `${process.env.MISSION_CODE_PREFIX}${resultado}`;
};

const hasNickname = async (nickname) => {
  const response = await (
    await fetch(`https://www.habbo.com.br/api/public/users?name=${nickname}`)
  ).json();

  if (response.error) return false;
  else return true;
};

const createAuthChannel = async (interaction) => {
  const { guild, member } = interaction;
  return await guild.channels.create({
    name: `autenticacao-${member.user.username}`,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: member.id,
        allow: [PermissionFlagsBits.ViewChannel],
      },
    ],
  });
};

const replyInteraction = async (interaction, authChannel) => {
  const embed = createEmbed().setDescription(
    `### Criamos o canal <#${authChannel.id}> para você continuar o seu processo de autenticação`
  );

  const reply = await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });

  setTimeout(async () => {
    await reply.delete();
  }, 10000);
};

const createMissionValidation = async (channel, nickname) => {
  if (await hasNickname(nickname)) {
    const missionCode = generateMissionCode();
    const embed = createEmbed()
      .setImage(
        `https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=gif&user=${nickname}&direction=3&head_direction=3&size=b`
      )
      .addFields({
        name: "--",
        value: "Você tem 2 minutos para concluir esta ação.",
      })
      .setDescription(
        "### Confirme que o personagem aparecendo nesta imagem é o seu! Caso esteja correto, adicione este código na sua missão: `" +
          missionCode +
          "`"
      );

    const missionButton = new ButtonBuilder()
      .setCustomId(`autenticar_mission_button|${nickname}|${missionCode}`)
      .setLabel("Já adicionei a missão!")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(missionButton);

    await channel.send({
      embeds: [embed],
      components: [row],
    });
  } else {
    const embed = createEmbed()
      .addFields({
        name: "--",
        value: "Este canal será excluído em 30 segundos.",
      })
      .setDescription("### Nickname não encontrado!");

    await channel.send({
      embeds: [embed],
    });

    setTimeout(async () => {
      await channel.delete();
    }, 5000);
  }
};

export const autenticar_nickname_modal = async (interaction) => {
  const nickname = interaction.fields.getTextInputValue(
    "autenticar_nickname_input"
  );
  const authChannel = await createAuthChannel(interaction);
  await replyInteraction(interaction, authChannel);
  await createMissionValidation(authChannel, nickname);
};
