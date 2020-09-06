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

export class CreatecartDialog extends ComponentDialog{
    constructor(id: string) {
        super(id || 'createcartDialog');

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.viewcartStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

private async viewcartStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cart = stepContext.options as Cart;
        if (cart.getCount() > 0){
        await stepContext.context.sendActivity({ attachments: [createAutoCartcard(cart.getCart(), "confirmPayload", cart.getcalculateTotal())] });              
                                }
        else{await stepContext.context.sendActivity("Your cart is empty!!!")}                        
        return await stepContext.endDialog();
}


}