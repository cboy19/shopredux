// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from 'botbuilder';
import { QnAMaker,LuisApplication } from 'botbuilder-ai';

// The bot and its main dialog.
import { DialogAndWelcomeBot } from './bots/dialogAndWelcomeBot';
import { MainDialog } from './dialogs/mainDialog';

// The bot's shop dialog
import { SearchDialog } from './dialogs/searchDialog';
const SEARCH_DIALOG = 'searchDialog';
import { ScanDialog } from './dialogs/scanDialog';
const SCAN_DIALOG = 'scanDialog';
import { ItemDialog } from './dialogs/itemDialog';
const ITEM_DIALOG = 'itemDialog';
import { CreatecartDialog } from './dialogs/createcartDialog';
const CREATECART_DIALOG = 'createcartDialog';
import { CheckoutDialog } from './dialogs/checkoutDialog';
const CHECKOUT_DIALOG = 'checkoutDialog';
import { DeleteDialog } from './dialogs/deleteDialog';
const DELETE_DIALOG = 'deleteDialog';
import { MyreqsDialog } from './dialogs/myreqsDialog';
const MYREQS_DIALOG = 'myreqsDialog';
import { FeedbackDialog } from './dialogs/feedbackDialog';
const FEEDBACK_DIALOG = 'feedbackDialog';
// The helper-class recognizer that calls Qna
import { QnaRecognizer } from './dialogs/QnaRecognizer';
// The helper-class recognizer that calls LUIS
import { LuisappRecognizer } from './dialogs/luisappRecognizer';



// Note: Ensure you have a .env file and include LuisAppId, LuisAPIKey and LuisAPIHostName.
const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    await conversationState.delete(context);
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Define a state store for your bot. See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state store to persist the dialog and user state between messages.
let conversationState: ConversationState;
let userState: UserState;

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

//If configured, pass teh QnARecognizer
let qnaMaker;
const { QnAKnowledgebaseId, QnAEndpointKey, QnAEndpointHostName } = process.env;
const qnaConfig: any = {knowledgeBaseId: QnAKnowledgebaseId, endpointKey: QnAEndpointKey, host: QnAEndpointHostName};

qnaMaker = new QnaRecognizer(qnaConfig);

// If configured, pass in the FlightBookingRecognizer. (Defining it externally allows it to be mocked for tests)
let luisRecognizer;
const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
const luisConfig: LuisApplication = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: `https://${ LuisAPIHostName }` };

luisRecognizer = new LuisappRecognizer(luisConfig);

// Create the main dialog.
const searchDialog = new SearchDialog(SEARCH_DIALOG);
const scanDialog = new ScanDialog(SCAN_DIALOG);
const itemDialog = new ItemDialog(ITEM_DIALOG);
const createcartDialog = new CreatecartDialog(CREATECART_DIALOG);
const checkoutDialog = new CheckoutDialog(CHECKOUT_DIALOG);
const deleteDialog = new DeleteDialog(DELETE_DIALOG);
const myreqsDialog = new MyreqsDialog(MYREQS_DIALOG);
const feedbackDialog = new FeedbackDialog(FEEDBACK_DIALOG);
const dialog = new MainDialog(luisRecognizer, qnaMaker,searchDialog, scanDialog, itemDialog,
                              createcartDialog, checkoutDialog, deleteDialog,
                              myreqsDialog, feedbackDialog);
const bot = new DialogAndWelcomeBot(conversationState, userState, dialog);

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});


// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', (req, res) => {
    // Route received a request to adapter for processing
    adapter.processActivity(req, res, async (turnContext) => {
        // route to bot activity handler.
        await bot.run(turnContext);
    });
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });
    // Set onTurnError for the BotFrameworkAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;

    streamingAdapter.useWebSocket(req, socket, head, async (context) => {
        // After connecting via WebSocket, run this logic for every request sent over
        // the WebSocket connection.
        await bot.run(context);
    });
});

server.get('/static/images/*', restify.plugins.serveStatic({
    directory: __dirname,
  }));