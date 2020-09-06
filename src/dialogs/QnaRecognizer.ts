// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RecognizerResult, TurnContext } from 'botbuilder';
import { QnAMaker, QnAMakerResult } from 'botbuilder-ai';

export class QnaRecognizer {
    private recognizer: QnAMaker;

    constructor(config: any) {
        const qnaIsConfigured = config && config.knowledgeBaseId && config.endpointKey && config.host;
        if (qnaIsConfigured) {

            this.recognizer = new QnAMaker(config);
        }
    }

    public get isConfigured(): boolean {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    public async executeQnaQuery(context: TurnContext): Promise<QnAMakerResult[]> {
        return this.recognizer.generateAnswer(context.activity.text);
    }


}
