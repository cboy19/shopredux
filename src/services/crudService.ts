import { config } from 'dotenv';
import { Items } from '../cards/types';
import { Cart } from '../cart/cart';
import { searchMappings, submitMapping } from '../cart/mappings';
const soapRequest = require('./coreService');
let xmlParser = require('xml2json');

const { searchUrl, createUrl, authKey } = process.env;

export async function searchItems(searchTerm:String): Promise<Items[]> {

    let searchxml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:Ariba:Buyer:vsap">
    <soapenv:Header>
    <urn:Headers>
        <!--You may enter the following 2 items in any order-->
        <!--Optional:-->
        <urn:variant>vrealm_2448</urn:variant>
        <!--Optional:-->
        <urn:partition>prealm_2448</urn:partition>
    </urn:Headers>
    </soapenv:Header>
    <soapenv:Body>
    <urn:WSCatalogItemSearchRequest partition="?" variant="?">
        <!--Optional:-->
        <urn:WSCatalogSearchQueryRequest_Item>
            <!--Optional:-->
            <urn:item>
                <!--You may enter the following 4 items in any order-->
                <urn:SearchTerms>
                <!--1 or more repetitions:-->
                <urn:item>
                    <!--You may enter the following 3 items in any order-->
                    <urn:Field>MatchAll</urn:Field>
                    <urn:Operator>like</urn:Operator>
                    <urn:Values>
                        <!--1 or more repetitions:-->
                        <urn:item>${searchTerm}</urn:item>
                    </urn:Values>
                </urn:item>
                </urn:SearchTerms>
                <urn:Sort></urn:Sort>
                <urn:SortDirection></urn:SortDirection>
                <urn:UserId>CN_Enhanced_Store_User</urn:UserId>
            </urn:item>
        </urn:WSCatalogSearchQueryRequest_Item>
    </urn:WSCatalogItemSearchRequest>
    </soapenv:Body>
    </soapenv:Envelope>`;

    const url = 'https://s1.a.com/Buyer/soap/test-APAC-T/WSCatalogItemSearch';
    const sampleHeaders = {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': "/Process Definition",
        'Authorization': 'Basic c2FwdXNlcjpXYWxtYXJ0QDEy1MzQ1Ng==1234',
        'Content-Length': searchxml.length,
        'Host': 's1.ariba.com',
        'Connection': 'Keep-Alive',
        'User-Agent': 'Apache-HttpClient/4.1.1 (java 1.5)'
        };


    let searchItems:Items[] = [];
    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: searchxml, timeout: 1000000 }); // Optional timeout parameter(milliseconds)
    const { headers, body, statusCode } = response;
  //  console.log(headers);
   // console.log(body);
  //  console.log(statusCode);
    if (statusCode == 200){
        var result = xmlParser.toJson(body, {
            object: true,
            reversible: false,
            coerce: true,
            sanitize: true,
            trim: true,
            arrayNotation: false
         });

    searchItems = searchMappings(result["soap:Envelope"]["soap:Body"]["WSCatalogItemSearchReply"]["WSCatalogSearchResponse_Item"]["item"]["CatalogItems"]["item"]); 


    }
    else {
        console.log(statusCode);
    }


  
  return searchItems;
}


export async function createCart(cart:Cart): Promise<String> {

    let inputxml = submitMapping(cart);

    const url = 'https://s1.a.com/Buyer/soap/test-APAC-T/RequisitionImportPull';
    const sampleHeaders = {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': "/Process Definition",
        'Authorization': 'Basic c2FwdXNlcjpXYWxtYXJ0QDEyMz1Q1Ng==1234',
        'Content-Length': inputxml.length,
        'Host': 's1.ariba.com',
        'Connection': 'Keep-Alive',
        'User-Agent': 'Apache-HttpClient/4.1.1 (java 1.5)'
        };

    let reqNumber;
    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: inputxml, timeout: 1000000 }); // Optional timeout parameter(milliseconds)
    const { headers, body, statusCode } = response;
    if (statusCode == 200){
        var result = xmlParser.toJson(body, {
            object: true,
            reversible: false,
            coerce: true,
            sanitize: true,
            trim: true,
            arrayNotation: false
         });

         let req = result["soap:Envelope"]["soap:Body"]["RequisitionImportPullReply"]["Requisition_RequisitionIdExport_Item"]["item"].UniqueName;
         reqNumber = `Your PR# : ${req} `;

    }
    else {
        console.log(statusCode);
    }

  
  return reqNumber;
}