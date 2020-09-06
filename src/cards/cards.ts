import { MessageFactory, Activity, CardFactory, Attachment } from "botbuilder";
import { Items } from "./types";
import {s} from "metronical.proto";
import { config } from 'dotenv';
import * as path from 'path';

let create = {buttonPressed:"&createpr"};
let list = {buttonPressed:"&list"};
let feedback = {buttonPressed:"&feedback"};
let viewcart = {buttonPressed:"&viewCart"};

const ENV_FILE = path.join(__dirname, '..', '..', '.env');
config({ path: ENV_FILE });
let serverPath = process.env.serverUrl;

//carosule - item cards
export function createCarosule(data: Items[]): Partial<Activity> {

    const itemCards = [];
    for(let i = 0; i < data.length; i++){
        itemCards.push(createItemCard(data[i]));
    }
    return MessageFactory.carousel(itemCards);
}

//list - show my  pr's
export function createList(data: Items[]): Partial<Activity> {

    const itemCards = [];
    for(let i = 0; i < data.length; i++){
        itemCards.push(createItemCard(data[i]));
    }
    return MessageFactory.list(itemCards);
}

//items
export function createItemCard(data: Items  ): Attachment {
    let description:String = s(String(data.description)).stripHtml().truncateWords(30).toString();
    let finalprice: String = `${data.price} ${data.currency}`;

    return CardFactory.adaptiveCard({
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "Image",
                        "altText": "No Image",
                        "id": "Image",
                        "spacing": "None",
                        "url": data.imgUrl,
                        "width": "100px",
                        "height": "100px"
                    }
                ],
                "id": "ImgContainer"
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "RichTextBlock",
                                        "inlines": [
                                            {
                                                "type": "TextRun",
                                                "text": description
                                            }
                                        ],
                                        "id": "desc"
                                    }
                                ],
                                "id": "descColumn"
                            },
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": finalprice,
                                        "id": "price"
                                    }
                                ],
                                "id": "priceColumn"
                            }
                        ],
                        "id": "ColumnSet1"
                    },
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "Input.Number",
                                        "placeholder": "Quantity",
                                        "min": 1,
                                        "max": 100,
                                        "value": data.quantity,
                                        "id": "quantity",
                                        "spacing": "Large"
                                    }
                                ],
                                "id": "qtyColumn",
                                "spacing": "None"
                            },
                            {
                                "type": "Column",
                                "width": "50px",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": data.uom,
                                        "id": "unit"
                                    }
                                ],
                                "id": "uomColumn"
                            },
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "ActionSet",
                                        "actions": [
                                            {
                                                "type": "Action.Submit",
                                                "title": "Add+",
                                                "id": "add",
                                                "data": {"value":data, "buttonPressed": '&addItem'}
                                            }
                                        ],
                                        "id": "actionSet"
                                    }
                                ],
                                "id": "actionColumn"
                            }
                        ],
                        "id": "ColumnSet2"
                    }
                ],
                "id": "detailsContainer"
            }
        ],
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
    });

}


// Recent PR's



//welcome
export function createWelcomeCard(): Attachment {
    let welocmeUrl = `${serverPath}/static/images/welcome.png`;
    return CardFactory.adaptiveCard({
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "Image",
                                "altText": "",
                                "url": welocmeUrl
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "**Welcome to @BuyIt!**",
                                "id": "Title"
                            },
                            {
                                "type": "TextBlock",
                                "text": `Please select from the below options...you can always say **"start" -** to start again **"quit" -** to quit anytime`,
                                "id": "Description",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "horizontalAlignment": "Center",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "ActionSet",
                                                "actions": [
                                                    {
                                                        "type": "Action.Submit",
                                                        "title": "Create PR's",
                                                        "id": "create",
                                                        "data": create
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "ActionSet",
                                                "actions": [
                                                    {
                                                        "type": "Action.Submit",
                                                        "title": "My PR's",
                                                        "id": "list",
                                                        "data": list
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "ActionSet",
                                                "actions": [
                                                    {
                                                        "type": "Action.Submit",
                                                        "title": "Feedback",
                                                        "id": "feedback",
                                                        "data": feedback
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
    });

}


//searching
export function createSearchingCard(): Attachment {

    return CardFactory.adaptiveCard({
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [],
        "id": "Searching",
        "verticalContentAlignment": "Center",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "lang": "EN",
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Continue Searching...",
                "style": "positive",
                "data": create
            }
        ]
    });

}


export function viewCart(): Attachment {

    return CardFactory.adaptiveCard({
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [],
        "id": "Searching2",
        "verticalContentAlignment": "Center",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "lang": "EN",
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Item Added to Cart !!! (View Cart)",
                "id": "viewCart",
                "style": "positive",
                "data": viewcart
            },
            {
                "type": "Action.Submit",
                "title": "Continue Searching...",
                "style": "positive",
                "data": create
            }
        ]
    });

}

// display PR

export function displayPR(data:any): Attachment {

    return CardFactory.adaptiveCard({
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [],
        "id": "Searching",
        "verticalContentAlignment": "Center",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "lang": "EN",
        "actions": [
            {
                "type": "Action.OpenUrl",
                "title": data.msg,
                "style": "positive",
                "url": data.url
            }
        ]
    });

}
