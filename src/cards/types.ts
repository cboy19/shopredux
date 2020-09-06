export interface Items {
    description: String,
    supplierpartId: String,
    imgUrl: String,
    price: Number,
    currency: String,
    quantity: String,
    uom: String,
    supplier: Number,
    mcccode: Number,
    auxiliary: String,
    subtotal: String,
    key:String
};

export interface Carts {
    key:String
    index: String,
    description: String,
    supplierpartId: String,
    imgUrl: String,
    price: String,
    currency: String,
    quantity: String,
    uom: String,
    supplier: Number,
    mcccode: Number,
    auxiliary: String,
    subtotal: String
};

export interface Requisition {
    aribapr: String,
    eccpr: String,
    date: Date
};

export enum Button_text {
    addItem   = "&addItem",
    viewCart  = "&viewCart",
    checkout  = "&checkout",
    delete    = "&delete",
    reviewOrder = "&reviewOrder",
    cancel    = "&cancel",
    order     = "&order"
};



export var Cartcard = {
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
            "id": "checkout",
            "color": "Good"
        },
        {
            "type": "Container",
            "items": [

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
                            "text": "25.00",
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
                            "text": "USD",
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
    "id": "root"
};


export var Item = {
        "type": "Container",
        "items": [
            {
                "type": "TextBlock",
                "text": "Description",
                "weight": "Bolder",
                "spacing": "None",
                "id": "desc0",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": " ",
                "weight": "Bolder",
                "spacing": "Medium",
                "id": "emptytext10"
            },
            {
                "type": "ColumnSet",
                "separator": true,
                "columns": [
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": " ",
                                "id": "etext0"
                            },
                            {
                                "type": "Image",
                                "altText": "",
                                "id": "pimage0"
                            }
                        ],
                        "id": "columntext10"
                    },
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "ColumnSet",
                                "id": "internal0",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": " ",
                                                "id": "inttextempty0"
                                            }
                                        ],
                                        "id": "10"
                                    },
                                    {
                                        "type": "Column",
                                        "width": 50,
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": " ",
                                                "id": "inttextempty20"
                                            }
                                        ],
                                        "id": "20"
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "id": "30",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "altText": "",
                                                "id": "delete0",
                                                "url": "/Users/ips/Downloads/images/delete.png",
                                                "spacing": "Small",
                                                "horizontalAlignment": "Right",
                                                "size": "Small",
                                                "width": "30px"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "ColumnSet",
                                "id": "pricecloumset",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": 50,
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "size": "ExtraLarge",
                                                "text": "10.00",
                                                "horizontalAlignment": "Right",
                                                "spacing": "None",
                                                "id": "price0"
                                            }
                                        ],
                                        "id": "pircecolumn"
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "id": "currcolumn",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "USD",
                                                "id": "curr"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "ColumnSet",
                                "id": "qtycolumnset",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": 50,
                                        "id": "qtycolumn",
                                        "items": [
                                            {
                                                "type": "Input.Number",
                                                "placeholder": "Quantity",
                                                "id": "qty0",
                                                "value": "",
                                                "min": 1,
                                                "max": 100
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "id": "uomcolumn",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "EA",
                                                "id": "uomtext",
                                                "size": "Small"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "id": "columninput20"
                    }
                ],
                "id": "columnset10"
            },
            {
                "type": "ColumnSet",
                "spacing": "Medium",
                "columns": [
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Sub Total",
                                "size": "Medium",
                                "id": "subtotal0",
                                "weight": "Bolder"
                            }
                        ],
                        "id": "subtotal10"
                    },
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "TextBlock",
                                "horizontalAlignment": "Right",
                                "text": "10.00",
                                "size": "Medium",
                                "weight": "Bolder",
                                "id": "subtotaltext0",
                                "color": "Accent"
                            }
                        ],
                        "id": "subtotal20"
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "id": "subtotalcurrcolumn",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "USD",
                                "id": "subtotcurr",
                                "color": "Accent"
                            }
                        ]
                    }
                ],
                "id": "colsetsubtotal0"
            }
        ],
        "id": "itemcontainer0",
        "style": "emphasis",
        "backgroundImage": "/Users/ips/Downloads/images/whitebkgd.png"
    };


