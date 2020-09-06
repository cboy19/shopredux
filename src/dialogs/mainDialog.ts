// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TimexProperty } from '@microsoft/recognizers-text-data-types-timex-expression';
import { SearchTerm } from './searchTerm';
import { Button_text } from '../cards/types';
import { InputHints, MessageFactory, StatePropertyAccessor, TurnContext } from 'botbuilder';
import { LuisRecognizer } from 'botbuilder-ai';
import { createWelcomeCard } from "../cards/cards";
import {
    ComponentDialog,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { SearchDialog } from './searchDialog';
import { ScanDialog } from './scanDialog';
import { ItemDialog } from './itemDialog';
import { CreatecartDialog } from './createcartDialog';
import { CheckoutDialog } from './checkoutDialog';
import { DeleteDialog } from './deleteDialog';
import { MyreqsDialog } from './myreqsDialog';
import { FeedbackDialog } from './feedbackDialog';
import { QnaRecognizer } from './QnaRecognizer';
import { LuisappRecognizer } from './luisappRecognizer';
import { Cart } from '../cart/cart';

const SEARCH_DIALOG = 'searchDialog';
const SCAN_DIALOG = 'scanDialog';
const ITEM_DIALOG = 'itemDialog';
const CREATECART_DIALOG = 'createcartDialog';
const CHECKOUT_DIALOG = 'checkoutDialog';
const DELETE_DIALOG = 'deleteDialog';
const MYREQS_DIALOG = 'myreqsDialog';
const FEEDBACK_DIALOG = 'feedbackDialog';
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

export class MainDialog extends ComponentDialog {
    private luisRecognizer: LuisappRecognizer;
    private qnaRecognizer: QnaRecognizer;
    private cart:Cart;
    private searchTerm: SearchTerm;

    constructor(luisRecognizer: LuisappRecognizer, qnaRecognizer: QnaRecognizer , searchDialog: SearchDialog, scanDialog: ScanDialog, itemDialog: ItemDialog, 
                createcartDialog: CreatecartDialog, checkoutDialog: CheckoutDialog, deleteDialog: DeleteDialog,
                myreqsDialog: MyreqsDialog, feedbackDialog: FeedbackDialog) {
        super('MainDialog');

        if (!qnaRecognizer) throw new Error('[MainDialog]: Missing parameter \'qnaRecognizer\' is required');
        this.qnaRecognizer = qnaRecognizer;

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        if (!searchDialog) throw new Error('[MainDialog]: Missing parameter \'searchDialog\' is required');

        if (!scanDialog) throw new Error('[MainDialog]: Missing parameter \'scanDialog\' is required');

        if (!itemDialog) throw new Error('[MainDialog]: Missing parameter \'itemDialog\' is required');

        if (!createcartDialog) throw new Error('[MainDialog]: Missing parameter \'createcartDialog\' is required');

        if (!checkoutDialog) throw new Error('[MainDialog]: Missing parameter \'checkoutDialog\' is required');

        if (!deleteDialog) throw new Error('[MainDialog]: Missing parameter \'deleteDialog\' is required');

        if (!myreqsDialog) throw new Error('[MainDialog]: Missing parameter \'myreqsDialog\' is required');

        if (!feedbackDialog) throw new Error('[MainDialog]: Missing parameter \'feedbackDialog\' is required');

        this.searchTerm = new SearchTerm();

        // Define the main dialog and its related components.
        
        this.addDialog(searchDialog)
            .addDialog(itemDialog)
            .addDialog(createcartDialog)
            .addDialog(checkoutDialog)
            .addDialog(deleteDialog)
            .addDialog(myreqsDialog)
            .addDialog(feedbackDialog)
            .addDialog(scanDialog)
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.initialStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {TurnContext} context
     */
    public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }


    private async initialStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
/*
        if(JSON.parse(stepContext.context.activity.text).buttonPressed)
        {
            console.log(JSON.parse(stepContext.context.activity.text).scanText);
        } */

        if ((stepContext.context.activity.value != null) && (stepContext.context.activity.value.buttonPressed)) {
 

            if( (<any>Object).values(Button_text).includes(stepContext.context.activity.value.buttonPressed) ){
                    this.cart = Cart.getInstance(stepContext.context.activity.from.id);
            } 
            // check the button selected
                switch (stepContext.context.activity.value.buttonPressed) {

                    case "&createpr":
                        return await stepContext.beginDialog(SEARCH_DIALOG, this.searchTerm);
                    case "&addItem":
                        return await stepContext.beginDialog(ITEM_DIALOG, this.cart);
                    case "&viewCart":
                        return await stepContext.beginDialog(CREATECART_DIALOG, this.cart);
                    case "&checkout":
                        return await stepContext.beginDialog(CHECKOUT_DIALOG, this.cart);    
                    case "&delete" :
                    case "&reviewOrder":    
                    case "&order": 
                    case "&cancel":{ 
                        return await stepContext.beginDialog(DELETE_DIALOG, this.cart);  
                                   }
                    case "&list":
                        return await stepContext.beginDialog(MYREQS_DIALOG);
                    case "&feedback":
                        return await stepContext.beginDialog(FEEDBACK_DIALOG, this.searchTerm);
                    case "&scan":
                        return await stepContext.beginDialog(SCAN_DIALOG, this.searchTerm);
                    case "&close":
                        Cart.removeInstance(stepContext.context.activity.from.id);           
                    default:
                        return await stepContext.next();

                                                                          };
                                                                                                                 }
        else if (stepContext.context.activity.type === "message" && !stepContext.context.responded){ 

                    // QnA maker

                        const qnaResults = await this.qnaRecognizer.executeQnaQuery(stepContext.context);
                        if (qnaResults.length > 0) {    
                            if (qnaResults[0].answer === "Hello") {
                               await stepContext.context.sendActivity({ attachments: [createWelcomeCard()] });
                            }
                            else {
                                await stepContext.context.sendActivity(qnaResults[0].answer);
                            }
                        }
                        else {
                              await  stepContext.context.sendActivity("Sorry we couldnt find the answer...will update Administrator");
                             }

                             return await stepContext.next();
                                      
                                                                                                    }                                                                                                         
        else { return await stepContext.next(); }                                                                                                         
    }  
    
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const result = stepContext.result;
        return await stepContext.endDialog();
    }  

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
     * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
     
    private async introStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (!this.luisRecognizer.isConfigured) {
            const luisConfigMsg = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(luisConfigMsg, null, InputHints.IgnoringInput);
            return await stepContext.next();
        }

        const messageText = (stepContext.options as any).restartMsg ? (stepContext.options as any).restartMsg : 'What can I help you with today?\nSay something like "Book a flight from Paris to Berlin on March 22, 2020"';
        const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt('TextPrompt', { prompt: promptMessage });
    }
            */
    /**
     * Second step in the waterall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
     * Then, it hands off to the bookingDialog child dialog to collect any remaining details.
     
    private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const bookingDetails = new BookingDetails();

        if (!this.luisRecognizer.isConfigured) {
            // LUIS is not configured, we just run the BookingDialog path.
            return await stepContext.beginDialog('bookingDialog', bookingDetails);
        }

        // Call LUIS and gather any potential booking details. (Note the TurnContext has the response to the prompt)
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        switch (LuisRecognizer.topIntent(luisResult)) {
        case 'BookFlight':
            // Extract the values for the composite entities from the LUIS result.
            const fromEntities = this.luisRecognizer.getFromEntities(luisResult);
            const toEntities = this.luisRecognizer.getToEntities(luisResult);

            // Show a warning for Origin and Destination if we can't resolve them.
            await this.showWarningForUnsupportedCities(stepContext.context, fromEntities, toEntities);

            // Initialize BookingDetails with any entities we may have found in the response.
            bookingDetails.destination = toEntities.airport;
            bookingDetails.origin = fromEntities.airport;
            bookingDetails.travelDate = this.luisRecognizer.getTravelDate(luisResult);
            console.log('LUIS extracted these booking details:', JSON.stringify(bookingDetails));

            // Run the BookingDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
            return await stepContext.beginDialog('bookingDialog', bookingDetails);

        case 'GetWeather':
            // We haven't implemented the GetWeatherDialog so we just display a TODO message.
            const getWeatherMessageText = 'TODO: get weather flow here';
            await stepContext.context.sendActivity(getWeatherMessageText, getWeatherMessageText, InputHints.IgnoringInput);
            break;

        default:
            // Catch all for unhandled intents
            const didntUnderstandMessageText = `Sorry, I didn't get that. Please try asking in a different way (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
            await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
        }

        return await stepContext.next();
    }
*/
    /**
     * Shows a warning if the requested From or To cities are recognized as entities but they are not in the Airport entity list.
     * In some cases LUIS will recognize the From and To composite entities as a valid cities but the From and To Airport values
     * will be empty if those entity values can't be mapped to a canonical item in the Airport.
  
    private async showWarningForUnsupportedCities(context, fromEntities, toEntities) {
        const unsupportedCities = [];
        if (fromEntities.from && !fromEntities.airport) {
            unsupportedCities.push(fromEntities.from);
        }

        if (toEntities.to && !toEntities.airport) {
            unsupportedCities.push(toEntities.to);
        }

        if (unsupportedCities.length) {
            const messageText = `Sorry but the following airports are not supported: ${ unsupportedCities.join(', ') }`;
            await context.sendActivity(messageText, messageText, InputHints.IgnoringInput);
        }
    }
   */
    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (stepContext.result) {
            const result = stepContext.result as BookingDetails;
            // Now we have all the booking details.

            // This is where calls to the booking AOU service or database would go.

            // If the call to the booking service was successful tell the user.
            const timeProperty = new TimexProperty(result.travelDate);
            const travelDateMsg = timeProperty.toNaturalLanguage(new Date(Date.now()));
            const msg = `I have you booked to ${ result.destination } from ${ result.origin } on ${ travelDateMsg }.`;
            await stepContext.context.sendActivity(msg);
        }

        // Restart the main dialog waterfall with a different message the second time around
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
    }
    */
}
