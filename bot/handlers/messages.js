const { ADMIN_GROUP_ID, blockedUsers } = require("../config");
const { isSpamming } = require("../utils/spamProtection");

module.exports = function registerPrivateMessageHandler(bot) {
    bot.on("message", async (ctx, next) => {
        const chat = ctx.chat;
        const user = ctx.from;

        if (chat.type === "private") {
            if (blockedUsers.has(user.id)) {
                console.log(
                    `⛔️ Blocked user ${user.id} tried to send a message.`
                );
                return;
            }

            if (isSpamming(user.id)) {
                blockedUsers.add(user.id);

                await ctx.telegram.sendMessage(
                    user.id,
                    "🚫 شما به دلیل ارسال بیش از حد پیام بلاک شده‌اید. از این به بعد پیام‌هایتان برای ادمین فرستاده نخواهد شد."
                );

                await ctx.telegram.sendMessage(
                    ADMIN_GROUP_ID,
                    `🚫 کاربر ${user.first_name} با یوزرنیم @${
                        user.username ?? "—"
                    } با آی‌دی ${
                        user.id
                    } به دلیل اسپم بلاک شد.\n\n#SpamBlocked`,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "🔓 رفع بلاک",
                                        callback_data: `unban_${user.id}`,
                                    },
                                ],
                            ],
                        },
                    }
                );

                return;
            }

            const messageText = ctx.message.text || "[پیام غیرمتنی]";
            const now = new Date();
            const timeString = now.toLocaleString("fa-IR", {
                timeZone: "Asia/Tehran",
                hour12: false,
            });

            await ctx.telegram.sendMessage(
                ADMIN_GROUP_ID,
                `📥 پیام جدید در PV:\n\n🕒 ${timeString}\n👤 ${
                    user.first_name ?? ""
                } ${user.last_name ?? ""} (@${user.username ?? "—"})\n🆔 ${
                    user.id
                }\n\n📝 پیام:\n\n<code>${messageText}</code>\n\n#PrivateMessage`,
                {
                    parse_mode: "HTML",
                }
            );

            return;
        }

        await next();
    });
};
