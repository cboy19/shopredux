import { InputHints, MessageFactory } from 'botbuilder';
import {
    ComponentDialog,
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { Cart } from '../cart/cart';
import { createAutoCartcard } from "../cards/autocartcard";

const WATERFALL_DIALOG = 'waterfallDialog';

export class MyreqsDialog extends ComponentDialog{
    constructor(id: string) {
        super(id || 'myreqsDialog');

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.requestStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }


private async requestStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {

    await stepContext.context.sendActivity("This feature is coming soon!!!");
    return await stepContext.endDialog();

}

}