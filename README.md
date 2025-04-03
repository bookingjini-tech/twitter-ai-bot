# Twitter AI Bot

An automated Twitter bot that generates and posts professional tweets based on trending tech news. The bot uses AI to create content focused on technology, entrepreneurship, and innovation.

## Features

- **AI-Generated Content**: Uses Google's Gemini 2.0 Flash model to create professional tweets
- **News Integration**: Automatically fetches recent news from trusted sources
- **Custom Persona**: Tweets can be customized to reflect your professional persona
- **Automated Posting**: Directly posts to Twitter using the Twitter API
- **Content Filtering**: Ensures content is relevant and tweet-worthy

## Prerequisites

- Node.js (v14 or higher)
- Twitter Developer Account with API credentials
- Google API Key for Gemini AI
- Google Custom Search Engine ID

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/twitter-ai-bot.git
   cd twitter-ai-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Twitter API Credentials
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

   # Google Custom Search API Credentials
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CSE_ID=your_google_cse_id

   # Gemini AI API Key
   GEMINI_API_KEY=your_gemini_api_key
   ```

## Usage

Run the bot with the following command:

```
node index.js
```

The bot will:
1. Fetch relevant news about startup funding, AI, tech policy, etc.
2. Generate a professional tweet using Gemini AI
3. Post the tweet to Twitter

## Docker Support

The project includes Docker support for containerized deployment:

1. Build the Docker image:
   ```
   docker build -t twitter-ai-bot .
   ```

2. Run the container:
   ```
   docker run --env-file .env twitter-ai-bot
   ```

## Project Structure

- `index.js` - Main application entry point
- `system_prompt.js` - Contains the AI system prompt configuration
- `tools.js` - Contains utility functions for news fetching and tweet posting
- `.env` - Environment variables for API keys and configuration
- `Dockerfile` - Docker configuration for containerization

## Customization

The bot can be customized by modifying:
- The keywords in `tools.js` to change the news topics
- The system prompt in `system_prompt.js` to adjust the tweet style and persona
- The trusted domains in `tools.js` to change news sources

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Regularly rotate your API keys
- Monitor API usage to avoid hitting rate limits

## License

ISC

## Disclaimer

This bot is intended for professional use and should adhere to Twitter's terms of service and API usage guidelines. 