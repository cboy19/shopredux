import { InputHints, MessageFactory } from 'botbuilder';
import {
    ComponentDialog,
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';
//import { createCarosule, createItemCard, createWelcomeCard, viewCart, createSearchingCard } from "../cards/cards";
import { Cart } from '../cart/cart';
import { createAutoCartcard } from "../cards/autocartcard";

const WATERFALL_DIALOG = 'waterfallDialog';

export class CheckoutDialog extends ComponentDialog{
    constructor(id: string) {
        super(id || 'checkoutDialog');

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.checkoutStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }


private async checkoutStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const cart = stepContext.options as Cart;
    if (cart.getCount() > 0) {
        cart.updateCart(stepContext.context.activity.value);
  //      await stepContext.context.sendActivity({ attachments: [createAutoCartcard(cart.getCart(), "orderPayload", cart.getcalculateTotal())] });
  // above comment is to display the confirm card again
          await stepContext.context.sendActivity({ attachments: [createAutoCartcard(cart.getCart(), "confirmPayload", cart.getcalculateTotal())] });              


    return await stepContext.endDialog(cart);
    }else { await stepContext.context.sendActivity("Your Cart is Empty!!!");}
    return await stepContext.endDialog();

}

}