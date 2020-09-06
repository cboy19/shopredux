import {
    ComponentDialog,
    DialogTurnResult,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
import { viewCart } from "../cards/cards";
import { Cart } from '../cart/cart'

const WATERFALL_DIALOG = 'waterfallDialog';

export class ItemDialog extends ComponentDialog{
    constructor(id: string) {
        super(id || 'itemDialog');

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.addItem.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

private async addItem(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const cart = stepContext.options as Cart;

    if (stepContext.context.activity.value.quantity > 0) {
        stepContext.context.activity.value.value.quantity = stepContext.context.activity.value.quantity;
        cart.addItem(stepContext.context.activity.value.value);
        await stepContext.context.sendActivity({ attachments: [viewCart()] });
        return await stepContext.endDialog(cart);
                                                         }
    else { 
          await stepContext.context.sendActivity("Please update the Quantity"); 
        //  return await stepContext.endDialog(cart);
        }
    
    return await stepContext.endDialog();

}

}