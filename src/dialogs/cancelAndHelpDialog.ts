// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InputHints, MessageFactory } from 'botbuilder';
import { ComponentDialog, DialogContext, DialogTurnResult, DialogTurnStatus } from 'botbuilder-dialogs';
import { createWelcomeCard } from "../cards/cards";
/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */

const SEARCH_DIALOG = 'searchDialog';
const MYREQS_DIALOG = 'myreqsDialog';
const CONFIRM_PROMPT = 'confirmPrompt';
const FEEDBACK_DIALOG = 'feedbackDialog';

export class CancelAndHelpDialog extends ComponentDialog {
    constructor(id: string) {
        super(id);
    }

    public async onContinueDialog(innerDc: DialogContext): Promise<DialogTurnResult> {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    private async interrupt(innerDc: DialogContext): Promise<DialogTurnResult|undefined> {
        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.toLowerCase();

            switch (text) {
                case '':
                    const cancelMessageText1 = 'Cancelling current flow...';
                    await innerDc.context.sendActivity(cancelMessageText1, cancelMessageText1, InputHints.IgnoringInput);
                    return await innerDc.cancelAllDialogs();                    
                case 'quit':
                    const cancelMessageText = 'Cancelling current flow...';
                    await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                    return await innerDc.cancelAllDialogs();
                case 'start':
                    const cancelMessageTextstart = 'Cancelling current flow...';
                    await innerDc.context.sendActivity(cancelMessageTextstart, cancelMessageTextstart, InputHints.IgnoringInput);
                    await innerDc.context.sendActivity({ attachments: [createWelcomeCard()] });
                    return await innerDc.cancelAllDialogs();                    


  /*              case 'help':
                case '?':
                    const helpMessageText = 'Show help here';
                    await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                    return { status: DialogTurnStatus.waiting };
                case 'cancel':
                case 'quit':
                    const cancelMessageText = 'Cancelling current flow...';
                    await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                    return await innerDc.cancelAllDialogs(); */
            }
        }
        else if (innerDc.context.activity.value) { 
            if (innerDc.context.activity.value.buttonPressed){
                switch (innerDc.context.activity.value.buttonPressed) {
                    case "&createpr":
                        const cancelMessageText = 'Cancelling current flow...';
                        await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                        await innerDc.cancelAllDialogs();                         
                        return await innerDc.beginDialog(SEARCH_DIALOG);
                    case "&list":
                        await innerDc.beginDialog(MYREQS_DIALOG);
                        return { status: DialogTurnStatus.waiting };
                    case "&feedback": 
                        const cancelMessageTextfeed = 'Cancelling current flow...';
                        await innerDc.context.sendActivity(cancelMessageTextfeed, cancelMessageTextfeed, InputHints.IgnoringInput);
                        await innerDc.cancelAllDialogs(); 
                        return await innerDc.beginDialog(FEEDBACK_DIALOG);                           
                        

                                                                      };   

            }
            else{
            const cancelMessageText = 'Cancelling current flow...';
            await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
            return await innerDc.cancelAllDialogs();
                }
        }
    }
}
