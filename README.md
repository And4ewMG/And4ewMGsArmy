# And4ewMGsArmy
This is the official source code for And4ewMG's Army.

## License

Permission is hereby granted to use the code for any purpose, including personal and commercial applications, with the following restrictions:
> No credit or attribution is required if the code is used in closed-source projects.
>
> If the code is used in open-source projects, proper credit must be given to the original author, preferably in the README file.
>
> Upon inquiry, users must acknowledge that the code is not their original creation.
>
> The code, including any derivative works, may not be sold.

*(thanks ChatGPT for generating that for me)*


## How to Create:

**[!]** means you must pay attention and information is critical for the bot to run.

### How to Install:
In the terminal, run `npm init`, and input the following:
> `package name:` *(Your Choice)*
> 
> `version: v1.0.0`
> 
> `description:` *(Your Choice)*
> 
> **[!]** `entry point: index.js`
> 
> **[!]** `test command: node index.js`
> 
> `git repository: ` **EMPTY**
> 
> `keywords:` *(Your Choice)*
> 
> `author:` *(Your Choice)*
> 
> `license: UNLICENSED`

### How to Setup:

Ensure that you have Node.js installed.

In the terminal, run the following commands:
> `npm i discord.js`

### How to Use:
Find the file called `config.json` and change the following:
> `YOUR_BOT_TOKEN` to your actual bot token.
> 
> `YOUR_CLIENT_ID` to your bot's client ID.
> 
> `YOUR_GUILD_ID` to your bot's guild *(server)* ID.

To find your Client and Guild ID:
> Enable 'Developer Mode' in your Discord settings
> 
> Right click your Discord server and click 'Copy Server ID'
> 
> Right click your bot and click 'Copy Guild ID'

To find your token:
> Go to your discord bot in 'https://discord.com/developers/applications/*YOUR_CLIENT_ID*/bot'
> 
> Click 'Reset Token' or whatever it says, and if you have 2FA enabled you will have to input a code.
> 
> Copy your token and paste it in to where it says 'YOUR_BOT_TOKEN'

> **[!]** A discord token MUST be hidden from EVERYONE AT ALL COSTS *(including your highest up staff members)*.
> 
> If your token gets leaked, an attacker can get access to your ENTIRE DISCORD BOT and make it run malicious code.
> 
> A token looks something like 'MTI0NTQxMTQ1Nzg5MDM5MDE1OA.Ge3bXk.kZjwwBR5Wo4WZwjQzaF3dy3N' *(don't worry, I reset the token immediately after)*, also it's shortened because GitHub won't let me commit a file with a bot token.
> 
> If you think your token has been leaked, go back to 'https://discord.com/developers/applications/*YOUR_CLIENT_ID*/bot' and click 'Reset Token' immediately, and that will invalidate all previous tokens,
