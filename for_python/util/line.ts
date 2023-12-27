import { messagingApi } from '@line/bot-sdk';
import { channelAccessToken, to } from './../lineconfig.json';

const { MessagingApiClient } = messagingApi;

const client = new MessagingApiClient({
    channelAccessToken,
});

client.pushMessage({
    to,
    messages: [{type:"text", "text":"hello world1"},{type:"text", "text":"hello world2"},],
});
