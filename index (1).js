const mineflayer = require("mineflayer");

const botsConfig = [
  {
    username: "AT_nether_bot1",
    loginPassword: "82782782",
    warpCommand: "/is warp mine1",
  },
  {
    username: "AT_nether_bot3",
    loginPassword: "84784784",
    warpCommand: "/is warp mine2",
  }
];

const serverOptions = {
  host: "ir.skyblock.uz",
  port: 25566,
  version: "1.12",
  registerPassword: "abdu2006"
};

function createBot(config) {
  const bot = mineflayer.createBot({
    host: serverOptions.host,
    port: serverOptions.port,
    version: serverOptions.version,
    username: config.username,
  });

  bot.on("messagestr", (message) => {
    console.log(`[${config.username}] ${message}`);

    if (message.includes("/register")) {
      bot.chat(`/register ${serverOptions.registerPassword} ${serverOptions.registerPassword}`);
    }

    if (message.includes("/login")) {
      bot.chat(`/login ${config.loginPassword}`);
    }
  });

  bot.once("spawn", () => {
    console.log(`✅ [${config.username}] spawn bo‘ldi!`);

    // /is warp komandasi
    setTimeout(() => {
      bot.chat(config.warpCommand);
      console.log(`📦 [${config.username}] ${config.warpCommand} komandasi yuborildi`);

      // Kavlash 5s dan keyin boshlanadi
      setTimeout(() => {
        dig(bot, config.username);
      }, 5000);
    }, 5000);
  });

  bot.on("death", () => {
    console.log(`☠️ [${config.username}] o‘ldi, /back yozilmoqda...`);
    setTimeout(() => {
      bot.chat("/back");
    }, 3000);
  });

  bot.on("end", () => {
    console.log(`⚠️ [${config.username}] serverdan chiqdi. Qayta ulanmoqda...`);
    setTimeout(() => {
      createBot(config); // Qayta ulanadi
    }, 5000);
  });

  bot.on("error", (err) => {
    console.log(`❌ [${config.username}] xatolik:`, err.message);
  });
}

async function dig(bot, botName) {
  try {
    if (!bot.heldItem || !bot.heldItem.name.includes("pickaxe")) {
      const pickaxe = bot.inventory.items().find(i => i.name.includes("pickaxe"));
      if (pickaxe) await bot.equip(pickaxe, "hand");
      else {
        console.log(`🛑 [${botName}] belkurak topilmadi`);
        return bot.quit();
      }
    }

    const block = bot.blockAtCursor(6);
    if (!block) return setTimeout(() => dig(bot, botName), 200);

    await bot.dig(block);
    dig(bot, botName);
  } catch (err) {
    console.log(`⛏️ [${botName}] kavlash xatosi:`, err.message);
    setTimeout(() => dig(bot, botName), 500);
  }
}

// Har bir botni ishga tushiramiz
for (const config of botsConfig) {
  createBot(config);
}
