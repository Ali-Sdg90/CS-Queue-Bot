const { Telegraf } = require("telegraf");

const bot = new Telegraf("8193011072:AAFPR_j20K0Le63JXlGuuxxG0OgtCJNdzu8");

const welcomeMessage = (username, firstName) => {
    return `سلام ${username ? "@" + username : firstName}
به گروه صف برنامه CS Internship خوش‌آمدید.

برای آشنایی با فرآیند مصاحبه، لطفاً پیام پین‌شده گروه را مطالعه کنید.
اگر درباره برنامه یا فرآیند مصاحبه سؤالی داشتید، می‌توانید در گروه مطرح کنید؛ خوشحال می‌شویم راهنمایی‌تان کنیم.

موفق باشید🌱`;
};

bot.on("new_chat_members", (ctx) => {
    const newMembers = ctx.message.new_chat_members;

    newMembers.forEach((member) => {
        const username = member.username;
        const firstName = member.first_name || "کاربر عزیز";
        
        ctx.reply(welcomeMessage(username, firstName));
    });
});

bot.launch();

console.log("Bot is ALIVE!");
