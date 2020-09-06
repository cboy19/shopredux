import { InputHints, MessageFactory } from 'botbuilder';
import {
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { SearchTerm } from './searchTerm';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import { createCarosule, createItemCard, createSearchingCard } from "../cards/cards";
import { searchItems } from '../services/crudService';

const items = require('../data/items');

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CONFIRM_PROMPT = 'confirmPrompt';

export class SearchDialog extends CancelAndHelpDialog{
    constructor(id: string) {
        super(id || 'searchDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.searchtermStep.bind(this),
                this.confirmStep.bind(this),
                this.searchStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

private async searchtermStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const messageText = 'What would you like to search? (search based on description/article#)'; 
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });   

}


private async confirmStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const searchTerm = stepContext.options as SearchTerm;
        searchTerm.term = stepContext.result;
        const messageText = `Please confirm, if you want to search for ${searchTerm.term}`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
// Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
  
}


private async searchStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {

    if (stepContext.result === true) {
    const searchTerm = stepContext.options as SearchTerm;
                    // search based on string
                    let result = await searchItems(searchTerm.term);
                    if (result.length > 0){
                        if (result.length > 1) {
                            await stepContext.context.sendActivity(createCarosule(result));
                            await stepContext.context.sendActivity({ attachments: [createSearchingCard()] });
                        }
                        else if (result.length === 1) {
                            await stepContext.context.sendActivity({ attachments: [createItemCard(result[0])] });
                            await stepContext.context.sendActivity({ attachments: [createSearchingCard()] });
                        }                       
                    }
                    else{

                        await stepContext.context.sendActivity(`Sorry couldnt find items for your search`);
                        /*
                    const data = items;
                    if (data.items.length > 1) {
                        await stepContext.context.sendActivity(createCarosule(data.items));
                        await stepContext.context.sendActivity({ attachments: [createSearchingCard()] });
                    }
                    else if (data[items].length === 1) {
                        await stepContext.context.sendActivity({ attachments: [createItemCard(data.items[0])] });
                        await stepContext.context.sendActivity({ attachments: [createSearchingCard()] });
                    }
                    */
                }

    return await stepContext.endDialog(searchTerm);
    }
    return await stepContext.endDialog();

}

}