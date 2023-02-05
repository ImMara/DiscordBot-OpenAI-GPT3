const { SlashCommandBuilder } = require('discord.js');
const { gpt } = require('../config.json');
const {OpenAIApi, Configuration} = require("openai");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Generate a random GPT-3 prompt')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The prompt to use')
                .setRequired(true)),

    async execute(interaction) {
        // get message from user
        const prompt = interaction.options.getString('prompt');
        // send message to GPT-3
        try{
            const config = new Configuration({ apiKey:gpt });
            const openai = new OpenAIApi(config);
            const response = await openai.createCompletion({
                model: 'davinci',
                prompt: prompt,
                temperature: 1,
            });
            // send response to user
            await console.log(`GPT-3 response: ${response.data.choices[0].text}`)
            await interaction.reply( prompt +"\n GPT RESPONSE:"+ response.data.choices[0].text );
        } catch (error) {
            if(error.response){
                console.error(error.response.status, error.response.data);
                await interaction.reply({ content: error.response.data.error.message, ephemeral: true });
            }else{
                console.error(`Error with OpenAI API request: ${error.message}`)
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}