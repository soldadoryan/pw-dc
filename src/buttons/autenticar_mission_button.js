import { createEmbed } from "../utils/embed";

export const verifyMission = async (nickname, missionCode) => {
  const response = await (
    await fetch(`https://www.habbo.com.br/api/public/users?name=${nickname}`)
  ).json();

  return response.motto === missionCode;
};

const deleteChannel = async (interaction) => {
  setTimeout(async () => {
    await interaction.channel.delete();
  }, 5000);
};

export const autenticar_mission_button = async (interaction) => {
  const nickname = interaction.customId.split("|")[1];
  const missionCode = interaction.customId.split("|")[2];
  if (await verifyMission(nickname, missionCode)) {
    const initialRole = interaction.guild.roles.cache.get(
      process.env.INITIAL_ROLE_ID
    );
    try {
      await interaction.member.roles.add(initialRole);
      await interaction.member.setNickname(nickname);
    } catch (error) {
      console.log(error);
      console.error(
        "O bot não possui permissão para alterar o cargo e o nickname deste usuário!"
      );
    }

    const embed = createEmbed().setDescription(
      "### Autenticação finalizada com sucesso! Alteramos seu apelido e seus cargos aqui no Discord."
    );

    await interaction.reply({
      embeds: [embed],
    });
  } else {
    await interaction.message.delete();
    const embed = createEmbed().setDescription(
      "### A missão não foi alterada corretamente. Você precisará repetir o processo de autenticação!"
    );

    await interaction.reply({
      embeds: [embed],
    });
  }
  await deleteChannel(interaction);
};
