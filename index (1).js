// index.js

const mineflayer = require("mineflayer");

const bot = mineflayer.createBot({
  host: "ir.skyblock.uz",
  port: 25566,
  version: "1.12",
  username: "AT_nether_bot1",
});

const password = "abdu2006";
const loginPassword = "";

bot.on("messagestr", (message) => {
  console.log(message);

  if (message.includes("/register")) {
    bot.chat(`/register ${password} ${password}`);
  }

  if (message.includes("/login")) {
    bot.chat(`/login ${loginPassword}`);
  }
});

bot.once("spawn", () => {
  console.log("✅ Bot muvaffaqiyatli spawn bo‘ldi!");

  // 5 soniya kutib /is warp mine1 ni yozadi
  setTimeout(() => {
    bot.chat("/is warp mine1");
    console.log("📦 /is warp mine1 komandasi yuborildi");

    // 5 sekunddan keyin kavlashni boshlaydi
    setTimeout(() => {
      dig();
    }, 5000);
  }, 5000);
});

// Kavlash funksiyasi
async function dig() {
  try {
    if (!bot.heldItem || !bot.heldItem.name.includes("pickaxe")) {
      const pickaxe = bot.inventory.items().find(i => i.name.includes("pickaxe"));
      if (pickaxe) await bot.equip(pickaxe, "hand");
      else return bot.quit();
    }

    const block = bot.blockAtCursor(6);
    if (!block) {
      return setTimeout(dig, 200);
    }

    await bot.dig(block);
    dig();
  } catch (err) {
    console.log("⛏️ Kavlashda xatolik:", err.message);
    setTimeout(dig, 500);
  }
}

// O'lganida avtomatik qaytish
bot.on("death", () => {
  console.log("☠️ Bot o‘ldi, /back yozilmoqda...");
  setTimeout(() => {
    bot.chat("/back");
  }, 3000);
});

// Ulanishdan chiqqanda qayta urinish
bot.on("end", () => {
  console.log("⚠️ Bot serverdan chiqdi. Qayta ulanmoqda...");
  setTimeout(() => {
    process.exit(1); // Render qayta ishga tushiradi
  }, 5000);
});

// Xatolikni ko‘rsatish
bot.on("error", (err) => {
  console.log("❌ Xatolik:", err.message);
});
