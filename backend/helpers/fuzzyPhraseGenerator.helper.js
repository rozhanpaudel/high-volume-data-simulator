const axios = require('axios');

const generateFuzzyPhrase = async () => {
    try {
        const response = await axios.get('https://random-words-api.vercel.app/word');
        const fuzzyPhrase = response.data[0].definition;
        return fuzzyPhrase
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports = generateFuzzyPhrase