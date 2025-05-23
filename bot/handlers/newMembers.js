const { GROUP_ID, BOT_VERSION } = require("../config");
const { createWorkItem } = require("../services/azure");

module.exports = function registerNewMembersHandler(bot) {
    bot.on("new_chat_members", async (ctx) => {
        try {
            if (ctx.message.chat.id.toString() !== GROUP_ID) {
                ctx.replyWithHTML(
                    "سلام\nاین بات فقط در گروه صف برنامه CS Internship قابل استفاده است.\n\nhttps://t.me/+X_TxP_odRO5iOWFi"
                );
                return;
            }

            const member = ctx.message.new_chat_participant;

            if (!member || typeof member !== "object") {
                console.error("Invalid member object:", member);
                return;
            }

            if (member.is_bot) {
                const botInfo =
                    `🚫 ورود بات‌ به گروه مجاز نیست! 🚫\n\n` +
                    `<b>نام بات:</b> ${
                        ctx.message.new_chat_participant.first_name || "نامشخص"
                    }\n` +
                    `<b>آیدی عددی:</b> <code>${ctx.message.new_chat_participant.id}</code>\n` +
                    `<b>یوزرنیم:</b> ${
                        ctx.message.new_chat_participant.username
                            ? `@${ctx.message.new_chat_participant.username}`
                            : "ندارد"
                    }`;

                await ctx.replyWithHTML(botInfo);
                await ctx.kickChatMember(member.id);

                console.log(
                    `Bot removed - ID: ${member.id} | Username: ${member.username}`
                );
                return;
            }

            if (!member.username) {
                await ctx.reply(`سلام ${member.first_name || ""}
به گروه صف برنامه CS Internship خوش آمدید.

لطفاً برای حساب کاربری تلگرام خود یک Username تنظیم کنید و پس از انجام این کار، در گروه اطلاع دهید.
توجه داشته باشید که داشتن Username برای شرکت در جلسات گروه و همچنین جلسه مصاحبه الزامی است.

سپاس از همکاری شما 🌱`);
                return;
            }

            await ctx.reply(`سلام @${member.username}
به گروه صف برنامه CS Internship خوش‌ آمدید.

برای آشنایی با فرآیند مصاحبه، لطفاً پیام‌های پین‌شده گروه را مطالعه کنید.
اگر درباره برنامه یا فرآیند مصاحبه سؤالی داشتید، می‌توانید در گروه مطرح کنید؛ خوشحال می‌شویم راهنمایی‌تان کنیم.

موفق باشید🌱`);

            try {
                await createWorkItem(ctx, member, false);
            } catch (error) {
                console.error("Error creating work item:", error);
                await ctx.reply("⚠️ خطا در ثبت اطلاعات اولیه کاربر");
            }
        } catch (error) {
            console.error("Error in new_chat_members handler:", error);
            ctx.replyWithHTML("⛔ خطای سیستمی!");
        }
    });
};
