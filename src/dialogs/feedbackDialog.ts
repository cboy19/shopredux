import { InputHints, MessageFactory, ConversationReference, TurnContext } from 'botbuilder';
import {
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { SearchTerm } from './searchTerm';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import { BlobStorage } from "botbuilder-azure";
import { Context } from 'mocha';

const items = require('../data/items');

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CONFIRM_PROMPT = 'confirmPrompt';

export class FeedbackDialog extends CancelAndHelpDialog{
    constructor(id: string) {
        super(id || 'feedbackDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.feedbacktermStep.bind(this),
                this.confirmStep.bind(this),
                this.updateStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

private async feedbacktermStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const messageText = "Please provide your feedback (Ex: Cant search for items with description 'Trays')"; 
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });   

}


private async confirmStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const feedbackTerm = stepContext.options as SearchTerm;
        feedbackTerm.feedback = stepContext.result;
        const messageText = `Administrator will receive this feedback :  ${feedbackTerm.feedback}`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
// Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
  
}


private async updateStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {

    if (stepContext.result === true) {

    const blobStorage = new BlobStorage({
        containerName: process.env.CONTAINER,
        storageAccountOrConnectionString: process.env.STORAGENAME
    });        

    const feedbackTerm = stepContext.options as SearchTerm;

    const details: String = await this.savefeedback(TurnContext.getConversationReference(stepContext.context.activity), feedbackTerm.feedback, blobStorage);
    await stepContext.context.sendActivity("Feedback Submitted to Admin");

    return await stepContext.endDialog(feedbackTerm);
    }
    return await stepContext.endDialog();

}

private async  savefeedback(ref: Partial<ConversationReference>, result: String, storage: BlobStorage): Promise<String>{
    const feedback = {};
    feedback[`references/${ref.activityId}`] = result;
    await storage.write(feedback);
    return Promise.resolve(ref.activityId);
}

}