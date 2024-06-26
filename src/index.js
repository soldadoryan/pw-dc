import dotenv from "dotenv";
import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  InteractionType,
} from "discord.js";
import Commands from "./commands/list.json";
import CommandsFunctions from "./commands";
import ModalsFunctions from "./modals";
import ButtonsFunctions from "./buttons";

dotenv.config();

const { TOKEN, CLIENT_ID } = process.env;

const Login = () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on("ready", () => {
    console.log(`[PW DC] Bot logado... (${client.user.tag})`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      CommandsFunctions[interaction.commandName](interaction);
      return;
    }
    if (interaction.type === InteractionType.ModalSubmit) {
      ModalsFunctions[interaction.customId](interaction);
      return;
    }
    if (interaction.isButton()) {
      ButtonsFunctions[interaction.customId.split("|")[0]](interaction);
      return;
    }

    return;
  });

  client.login(TOKEN);
};

const CreateCommands = async () => {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log("[PW DC] Iniciando sistema...");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: Commands });

    console.log("[PW DC] Atualizando comandos...");
  } catch (error) {
    console.error(error);
  }
};

const Main = async () => {
  CreateCommands();
  Login();
};

Main();
