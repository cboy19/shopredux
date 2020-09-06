import {
    ComponentDialog,
    DialogTurnResult,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { Cart } from '../cart/cart';
import { createAutoCartcard } from "../cards/autocartcard";
import { createCart } from '../services/crudService';
import { displayPR} from "../cards/cards";

const WATERFALL_DIALOG = 'waterfallDialog';
const url = "https://s1.ariba.com/Buyer/Main/aw?awh=r&awssk=y_T.V9uF&realm=wal-mart-supp-APAC-T&passwordadapter=ThridPartyUser&dard=1";
const data = {msg:"", url:url};

export class DeleteDialog extends ComponentDialog{
    constructor(id: string) {
        super(id || 'deleteDialog');

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.deleteStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }


private async deleteStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const cart = stepContext.options as Cart;
    if (stepContext.context.activity.value.buttonPressed === "&delete") {
        cart.deleteItem(stepContext.context.activity.value.value);
        await stepContext.context.sendActivity("Item Deleted from the cart");
        if(cart.getCount() > 0){
        await stepContext.context.sendActivity({ attachments: [createAutoCartcard(cart.getCart(), "confirmPayload", cart.getcalculateTotal())] });
                               }
    return await stepContext.endDialog(cart);
    }
    else if (stepContext.context.activity.value.buttonPressed === "&reviewOrder"){

        if(cart.getCount() > 0){
          cart.updateCart(stepContext.context.activity.value);  
          data.msg =  (await createCart(cart)).toString();
          cart.clear();
          Cart.removeInstance(stepContext.context.activity.from.id);
          await stepContext.context.sendActivity({ attachments: [displayPR(data)] });
        }
        else{ await stepContext.context.sendActivity("Your Cart is Empty!!!"); }
        return await stepContext.endDialog(cart);
    }
    else if (stepContext.context.activity.value.buttonPressed === "&order"){

            if(cart.getCount() > 0){
              data.msg =  (await createCart(cart)).toString();
              cart.clear();
              Cart.removeInstance(stepContext.context.activity.from.id);
              await stepContext.context.sendActivity({ attachments: [displayPR(data)] });
            }
            else{ await stepContext.context.sendActivity("Your Cart is Empty!!!"); }
            return await stepContext.endDialog(cart);
    }
    else if (stepContext.context.activity.value.buttonPressed === "&cancel"){
            if(cart.getCount() > 0){cart.clear();
                Cart.removeInstance(stepContext.context.activity.from.id);
                await stepContext.context.sendActivity("Your Order is Cancelled...");
            }
            else{ await stepContext.context.sendActivity("Your Cart is Empty!!!"); }
            return await stepContext.endDialog(cart);
    }

    return await stepContext.endDialog();

}

}