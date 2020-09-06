import {
    ComponentDialog,
    DialogTurnResult,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { createCarosule, createItemCard, createSearchingCard } from "../cards/cards";
import { searchItems } from '../services/crudService';


const WATERFALL_DIALOG = 'waterfallDialog';

export class ScanDialog extends ComponentDialog{
    constructor(id: string) {
        super(id || 'scanDialog');

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.searchStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

private async searchStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {

                    // search based on string
                    let result = await searchItems(stepContext.context.activity.value.scanText);
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
                    
                        await stepContext.context.sendActivity(`Sorry couldnt find items for your scan : ${stepContext.context.activity.value.scanText}`);
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

    //return await stepContext.endDialog(searchTerm);
    return await stepContext.endDialog();

}

}