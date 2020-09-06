import * as ACData from "adaptivecards-templating";
import { CardFactory, Attachment } from "botbuilder";
import { Carts } from "./types";
import { config } from 'dotenv';
import * as path from 'path';

let checkout = {buttonPressed:"&checkout"};
let order = {buttonPressed:"&order"};
let cancel = {buttonPressed:"&cancel"};
let reviewOrder = {buttonPressed:"&reviewOrder"};
let deleteItem = {buttonPressed:"&delete"}

const ENV_FILE = path.join(__dirname, '..', '..', '.env');
config({ path: ENV_FILE });
let serverPath = process.env.serverUrl;

var confirmPayload = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.0",
    "type": "AdaptiveCard",
    "body": [
        {
            "type": "TextBlock",
            "text": "Review",
            "weight": "Bolder",
            "horizontalAlignment": "Center",
            "size": "Large",
            "id": "review",
            "color": "Good"
        },
        {
            "type": "Container",
            "items": [
                {
                    "$data": "{items}",
                    "$index": "index",
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": " ",
                            "id": "emptyline",
                            "spacing": "None"
                        },
                        {
                            "type": "Image",
                            "altText": "",
                            "id": "image",
                            "url": "{imgUrl}",
                            "spacing": "None",
                            "size": "Stretch",
                            "horizontalAlignment": "Center",
                            "height": "100px"
                        },
                        {
                            "type": "ColumnSet",
                            "id": "descimgset",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": 50,
                                    "id": "desccolumn",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{description}",
                                            "weight": "Bolder",
                                            "spacing": "None",
                                            "id": "desc",
                                            "wrap": true,
                                            "maxLines": 4
                                        }
                                    ],
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": "5px",
                                    "id": "indexcolumn",
                                    "spacing": "None",
                                    "items": [
                                        {
                                            "type": "Input.Text",
                                            "placeholder": "Delete",
                                            "buttonPressed":"&delete",
                                            "id": "indexinput",
                                            "spacing": "None",
                                            "value": "{key}"
                                        }
                                    ],
                                    "isVisible": false
                                },                                
                                {
                                    "type": "Column",
                                    "width": "25px",
                                    "id": "deletecolumn",
                                    "spacing": "None",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "altText": "",
                                            "id": "deleteimg",
                                            "url": `${serverPath}/static/images/delete.png`,
                                            "spacing": "None",
                                            "horizontalAlignment": "Right",
                                            "style": "Person"
                                        }
                                    ],
                                    "selectAction": {
                                        "type": "Action.Submit",
                                        "id": "delete",
                                        "title": "delete",
                                        "data": "&test"
                                    }
                                }
                            ],
                            "spacing": "None"
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "None",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": 50,
                                    "id": "qty",
                                    "items": [
                                        {
                                            "type": "Input.Number",
                                            "placeholder": "Quantity",
                                            "id": "quantity",
                                            "min": 0,
                                            "max": 100,
                                            "value": "{quantity}",
                                            "spacing": "None"
                                        }
                                    ],
                                    "horizontalAlignment": "Left",
                                    "verticalContentAlignment": "Center",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "id": "uomcolumn",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{uom}",
                                            "id": "uomtext",
                                            "spacing": "None"
                                        }
                                    ],
                                    "horizontalAlignment": "Left",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "id": "pricecolumn",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{price}",
                                            "id": "pricetext",
                                            "horizontalAlignment": "Right",
                                            "spacing": "None"
                                        }
                                    ],
                                    "verticalContentAlignment": "Center",
                                    "horizontalAlignment": "Right",
                                    "width": 50,
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{currency}",
                                            "id": "currcolumn",
                                            "horizontalAlignment": "Center",
                                            "fontType": "Monospace",
                                            "spacing": "None"
                                        }
                                    ],
                                    "horizontalAlignment": "Center",
                                    "verticalContentAlignment": "Center",
                                    "spacing": "None"
                                }
                            ],
                            "id": "qtypriceset"
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "None",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": 1,
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Sub Total",
                                            "size": "Medium",
                                            "id": "subtotal00",
                                            "weight": "Bolder",
                                            "spacing": "None"
                                        }
                                    ],
                                    "id": "subtotal100",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": 1,
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "horizontalAlignment": "Right",
                                            "text": "{subtotal}",
                                            "size": "Medium",
                                            "weight": "Bolder",
                                            "id": "subtotaltext00",
                                            "color": "Accent",
                                            "spacing": "None"
                                        }
                                    ],
                                    "id": "subtotal200",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "id": "subtotalcurrcolumn0",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{currency}",
                                            "id": "subtotcurr0",
                                            "color": "Accent",
                                            "horizontalAlignment": "Center",
                                            "spacing": "None"
                                        }
                                    ],
                                    "horizontalAlignment": "Center",
                                    "verticalContentAlignment": "Center",
                                    "spacing": "None"
                                }
                            ],
                            "id": "colsetsubtotal00"
                        }
                    ],
                    "id": "itemcontainer",
                    "style": "emphasis",
                    "spacing": "None",
                    "backgroundImage": `${serverPath}/static/images/whitebkgd.png`
                }
            ],
            "id": "rootcontainer",
            "style": "accent"
        },
        {
            "type": "ColumnSet",
            "id": "totalset",
            "columns": [
                {
                    "type": "Column",
                    "width": 50,
                    "id": "totalcolumn",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Total",
                            "size": "Medium",
                            "isSubtle": true,
                            "weight": "Bolder",
                            "id": "total",
                            "color": "Dark"
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": 50,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "{total}",
                            "size": "Medium",
                            "id": "totaltext",
                            "horizontalAlignment": "Right",
                            "weight": "Bolder",
                            "color": "Accent"
                        }
                    ],
                    "id": "totalcol2"
                },
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "{currency}",
                            "id": "totalcurr",
                            "color": "Accent",
                            "horizontalAlignment": "Left"
                        }
                    ],
                    "id": "totalcurrcolumn",
                    "horizontalAlignment": "Left",
                    "verticalContentAlignment": "Center",
                    "style": "default"
                }
            ]
        },
        {
            "type": "ActionSet",
            "id": "checkoutset",
            "spacing": "None",
            "horizontalAlignment": "Center",
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Update Total !!!",
                    "id": "checkout",
                    "data": checkout,
                    "style": "positive"

                },
                {
                    "type": "Action.Submit",
                    "title": "Order",
                    "id": "reviewOrder",
                    "data": reviewOrder,
                    "style": "positive"
                },
                {
                    "type": "Action.Submit",
                    "title": "Cancel",
                    "id": "reviewCancel",
                    "data": cancel,
                    "style": "destructive"
                }
            ]
        }
    ],
    "id": "cartReview"
};

//order payload

let orderPayload = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.0",
    "type": "AdaptiveCard",
    "body": [
        {
            "type": "TextBlock",
            "text": "Check Out",
            "weight": "Bolder",
            "horizontalAlignment": "Center",
            "size": "Large",
            "id": "checkOutid",
            "color": "Good"
        },
        {
            "type": "ActionSet",
            "id": "checkoutset",
            "spacing": "None",
            "horizontalAlignment": "Center",
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Order",
                    "id": "orderid",
                    "data": order,
                    "style": "positive"
                },
                {
                    "type": "Action.Submit",
                    "title": "Cancel",
                    "id": "cancelid",
                    "data": cancel,
                    "style": "positive"
                }
            ]
        },
        {
            "type": "Container",
            "items": [
                {
                    "$data": "{items}",
                    "$index": "index",
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": " ",
                            "id": "emptyline",
                            "spacing": "None"
                        },
                        {
                            "type": "Image",
                            "altText": "No Img",
                            "id": "image",
                            "url": "{imgUrl}",
                            "spacing": "None",
                            "size": "Stretch",
                            "horizontalAlignment": "Center"
                        },
                        {
                            "type": "TextBlock",
                            "text": "{description}",
                            "weight": "Bolder",
                            "spacing": "None",
                            "id": "desc",
                            "wrap": true,
                            "maxLines": 4
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "None",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": 50,
                                    "id": "qty",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{quantity}",
                                            "id": "quantityid",
                                            "spacing": "None",
                                            "horizontalAlignment": "Center"
                                        }
                                    ],
                                    "horizontalAlignment": "Right",
                                    "verticalContentAlignment": "Center",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "id": "uomcolumn",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{uom}",
                                            "id": "uomtext",
                                            "spacing": "None"
                                        }
                                    ],
                                    "horizontalAlignment": "Left",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "id": "pricecolumn",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{price}",
                                            "id": "pricetext",
                                            "horizontalAlignment": "Right",
                                            "spacing": "None"
                                        }
                                    ],
                                    "verticalContentAlignment": "Center",
                                    "horizontalAlignment": "Right",
                                    "width": 50,
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{currency}",
                                            "id": "currcolumn",
                                            "horizontalAlignment": "Center",
                                            "fontType": "Monospace",
                                            "spacing": "None"
                                        }
                                    ],
                                    "horizontalAlignment": "Center",
                                    "verticalContentAlignment": "Center",
                                    "spacing": "None"
                                }
                            ],
                            "id": "qtypriceset"
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "None",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": 1,
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Sub Total",
                                            "size": "Medium",
                                            "id": "subtotal00",
                                            "weight": "Bolder",
                                            "spacing": "None"
                                        }
                                    ],
                                    "id": "subtotal100",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": 1,
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "horizontalAlignment": "Right",
                                            "text": "{subtotal}",
                                            "size": "Medium",
                                            "weight": "Bolder",
                                            "id": "subtotaltext00",
                                            "color": "Accent",
                                            "spacing": "None"
                                        }
                                    ],
                                    "id": "subtotal200",
                                    "spacing": "None"
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "id": "subtotalcurrcolumn0",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "{currency}",
                                            "id": "subtotcurr0",
                                            "color": "Accent",
                                            "horizontalAlignment": "Center",
                                            "spacing": "None"
                                        }
                                    ],
                                    "horizontalAlignment": "Center",
                                    "verticalContentAlignment": "Center",
                                    "spacing": "None"
                                }
                            ],
                            "id": "colsetsubtotal00"
                        }
                    ],
                    "id": "itemcontainer",
                    "style": "emphasis",
                    "spacing": "None",
                    "backgroundImage": `${serverPath}/static/images/whitebkgd.png`
                }
            ],
            "id": "rootcontainer",
            "style": "accent"
        },
        {
            "type": "ColumnSet",
            "id": "totalset",
            "columns": [
                {
                    "type": "Column",
                    "width": 50,
                    "id": "totalcolumn",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Total",
                            "size": "Medium",
                            "isSubtle": true,
                            "weight": "Bolder",
                            "id": "total",
                            "color": "Dark"
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": 50,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "{total}",
                            "size": "Medium",
                            "id": "totaltext",
                            "horizontalAlignment": "Right",
                            "weight": "Bolder",
                            "color": "Accent"
                        }
                    ],
                    "id": "totalcol2"
                },
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "{currency}",
                            "id": "totalcurr",
                            "color": "Accent",
                            "horizontalAlignment": "Left"
                        }
                    ],
                    "id": "totalcurrcolumn",
                    "horizontalAlignment": "Left",
                    "verticalContentAlignment": "Center",
                    "style": "default"
                }
            ]
        }
    ],
    "id": "root",
    "verticalContentAlignment": "Center",
    "lang": "EN"
};




let dataObject = {
             total:'',
             currency: "",
             items:[]
                 };

export function createAutoCartcard(data: Carts[], cardType: String, total:number): Attachment {   

// Create a Template instamce from the template payload
if (cardType == "confirmPayload") { var template = new ACData.Template(confirmPayload); }
else { var template = new ACData.Template(orderPayload); }

dataObject.total = total.toString();
dataObject.currency = data[0].currency.toString();
dataObject.items = data;



// Create a data binding context, and set its $root property to the
// data object to bind the template to
var context = new ACData.EvaluationContext();
context.$root = dataObject;

// "Expand" the template - this generates the final Adaptive Card,
// ready to render
var card = template.expand(context);
//var parseQty = 0;

if (cardType == "confirmPayload") {

for (let i = 0; i < card.body[1].items.length; i++) {
    card.body[1].items[i] = JSON.parse(JSON.stringify(card.body[1].items[i]), (key, value) => {
                                        if (key == 'id') {
                                            return value + i;
                                        } else {
                                            return value;
                                        }
                                    });
    card.body[1].items[i].items[2].columns[2].selectAction['data'] = card.body[1].items[i].items[2].columns[1].items[0];
 //   parseQty = +card.body[1].items[i].items[3].columns[0].items[0].value;
 //   card.body[1].items[i].items[3].columns[0].items[0].value = parseQty;
                             
    }
}
else {
    for (let i = 0; i < card.body[2].items.length; i++) {
        card.body[2].items[i] = JSON.parse(JSON.stringify(card.body[2].items[i]), (key, value) => {
                                            if (key == 'id') {
                                                return value + i;
                                            } else {
                                                return value;
                                            }
                                        });

                                                        }
}

return CardFactory.adaptiveCard(card);

}


 // bg - https://i5-qa.walmartimages.com/asr/86baf508-a411-46ee-b324-78dabca1e3c6_1.f15128525efe8a508a9ee5f68179ff76.jpeg