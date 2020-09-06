import { Cart } from './cart';
import { Items,Carts } from '../cards/types';
import { serviceUrl } from './globalvar';
import * as _ from "lodash";
let xmlParser = require('xml2json');
import { config } from 'dotenv';
import * as path from 'path';

export function searchMappings(searchItems:any): Items[] {

   const ENV_FILE = path.join(__dirname, '..', '..', '.env');
   config({ path: ENV_FILE });
   let serverPath = process.env.serverUrl;   

    let items:Items[] = [];
    /*
    searchItems.forEach(obj => {

        let punit = obj.ExtrinsicAttributes.item[1].Values.item;
        if((punit !== undefined) && ((<any>Object).values(punit).includes("WMSC")) || (punit === "WMSC")){
        let data:Items = <Items>{};
        if ( Object.keys(obj.Image).length === 0){
          //  data.imgUrl = `https://i5-qa.walmartimages.com/asr/b3646e4b-3f9b-4725-86bf-e794abbd182e_1.f7bffbbdf56c041784b2c25df092fdc7.png`;
            data.imgUrl = `${serviceUrl.serviceUrl}/static/images/noimage.png`;                 
         }else{data.imgUrl = obj.Image;}        
        data.description = obj.Description;
        data.auxiliary = obj.SupplierPartAuxiliaryId;
        data.supplierpartId = obj.SupplierPartId;
        data.mcccode = obj.ClassificationCode.item.Value;
        data.supplier = obj.SupplierId.item.Value;
        data.quantity = "0";
        data.uom = obj.UnitOfMeasure.Value;
        data.price = obj.Price.Amount;
        data.currency = obj.Price.Currency;
        data.subtotal = (+data.quantity * +data.price).toString();
        data.key = obj.Key;
        items.push(data);
                                                    }
    });
*/

if(searchItems.length > 1){
    _.forEach(searchItems,function(obj:any) {
      let myIndex = obj.ExtrinsicAttributes.item.findIndex(x => x.FieldName === "purchasingunit");
      let punit = obj.ExtrinsicAttributes.item[myIndex].Values.item;
      if((punit !== undefined) && ((<any>Object).values(punit).includes("WMSC")) || (punit === "WMSC")){
      let data:Items = <Items>{};
      if ( Object.keys(obj.Image).length === 0){
        //  data.imgUrl = `https://i5-qa.walmartimages.com/asr/b3646e4b-3f9b-4725-86bf-e794abbd182e_1.f7bffbbdf56c041784b2c25df092fdc7.png`;
          data.imgUrl = `${serverPath}/static/images/noimage.png`;                 
       }else{data.imgUrl = obj.Image;}        
      data.description = obj.Description;
      data.auxiliary = obj.SupplierPartAuxiliaryId;
      data.supplierpartId = obj.SupplierPartId;
      data.mcccode = obj.ClassificationCode.item.Value;
      data.supplier = obj.SupplierId.item.Value;
      data.quantity = "0";
      data.uom = obj.UnitOfMeasure.Value;
      data.price = obj.Price.Amount;
      data.currency = obj.Price.Currency;
      data.subtotal = (+data.quantity * +data.price).toString();
      data.key = obj.Key;
      items.push(data);      
      }
      });
   }
else if(searchItems.length === undefined)  
   {
      let myIndex = searchItems.ExtrinsicAttributes.item.findIndex(x => x.FieldName === "purchasingunit");
      let punit = searchItems.ExtrinsicAttributes.item[myIndex].Values.item;
      if((punit !== undefined) && ((<any>Object).values(punit).includes("WMSC")) || (punit === "WMSC")){
      let data:Items = <Items>{};
      if ( Object.keys(searchItems.Image).length === 0){
          data.imgUrl = `${serverPath}/static/images/noimage.png`;                 
       }else{data.imgUrl = searchItems.Image;}        
      data.description = searchItems.Description;
      data.auxiliary = searchItems.SupplierPartAuxiliaryId;
      data.supplierpartId = searchItems.SupplierPartId;
      data.mcccode = searchItems.ClassificationCode.item.Value;
      data.supplier = searchItems.SupplierId.item.Value;
      data.quantity = "0";
      data.uom = searchItems.UnitOfMeasure.Value;
      data.price = searchItems.Price.Amount;
      data.currency = searchItems.Price.Currency;
      data.subtotal = (+data.quantity * +data.price).toString();
      data.key = searchItems.Key;
      items.push(data);      
      }         
   } 
      return items;

}

export function submitMapping(cart:Cart): String{

    let cartItems = cart.getCart(); 

    return buildInput(cartItems);;

}


function buildInput(data:any): String{

    let mycreateInput = buildInputresult(data[0]);
    let mycreateItem = buildItemresult(data[0]);

    var resultInput = xmlParser.toJson(mycreateInput, {
        object: true,
        reversible: true,
        coerce: true,
        sanitize: true,
        trim: true,
        arrayNotation: true
     });

     var resultItem = xmlParser.toJson(mycreateItem, {
        object: true,
        reversible: true,
        coerce: true,
        sanitize: true,
        trim: true,
        arrayNotation: true
     });

    resultInput["soapenv:Envelope"][0]["soapenv:Body"][0]["urn:RequisitionImportPullRequest"][0]["urn:Requisition_RequisitionImportPull_Item"][0]["urn:item"][0]["urn:LineItems"].push(resultItem); 
    resultInput["soapenv:Envelope"][0]["soapenv:Body"][0]["urn:RequisitionImportPullRequest"][0]["urn:Requisition_RequisitionImportPull_Item"][0]["urn:item"][0]["urn:LineItems"].shift(); 
 
    let finalInput = xmlParser.toXml(resultInput, {reversible: true});

     return finalInput;

}


function buildInputresult(data:any):any {

let createInput = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:Ariba:Buyer:vsap">
   <soapenv:Header>
      <urn:Headers>
         <urn:variant>vrealm_2448</urn:variant>
         <urn:partition>prealm_2448</urn:partition>
      </urn:Headers>
   </soapenv:Header>
   <soapenv:Body>
      <urn:RequisitionImportPullRequest partition="prealm_2448" variant="vrealm_2448">
         <urn:Requisition_RequisitionImportPull_Item>
            <urn:item>
               <urn:CompanyCode>
                  <urn:UniqueName>D075</urn:UniqueName>
               </urn:CompanyCode>
               <urn:DefaultLineItem>
                  <urn:DeliverTo>test_D0r00ag</urn:DeliverTo>
                  <urn:NeedBy>2020-12-01T00:00:00</urn:NeedBy>
               </urn:DefaultLineItem>
               <urn:LineItems>
               </urn:LineItems>
               <urn:Name>Test Requistion Import ** TEST **</urn:Name>
               <urn:OriginatingSystem>SAP</urn:OriginatingSystem>
               <urn:Preparer>
                  <urn:PasswordAdapter>ThirdPartyUser</urn:PasswordAdapter>
                  <urn:UniqueName>test_D0r00ag</urn:UniqueName>
               </urn:Preparer>
               <urn:Requester>
                 <urn:PasswordAdapter>PasswordAdapter1</urn:PasswordAdapter>
                  <urn:UniqueName>test_D0r00ag</urn:UniqueName>
               </urn:Requester>
               <urn:OriginatingSystemReferenceID>PR001</urn:OriginatingSystemReferenceID>
			<urn:UniqueName>PR001</urn:UniqueName>
			<urn:Operation>new</urn:Operation>
            </urn:item>
         </urn:Requisition_RequisitionImportPull_Item>
      </urn:RequisitionImportPullRequest>
   </soapenv:Body>
</soapenv:Envelope>

`;


return createInput;
    
}

function buildItemresult(data:any):any {    

let supplier = data.supplier.toUpperCase();  

let createItem = `
                  <urn:item>
                     <urn:BillingAddress>
                        <urn:UniqueName>D10</urn:UniqueName>
                     </urn:BillingAddress>
                     <urn:CommodityCode>
                        <urn:UniqueName>${data.mcccode}</urn:UniqueName>
                     </urn:CommodityCode>
                     <urn:Description>
                        <urn:CommonCommodityCode>
                          <urn:Domain>custom</urn:Domain>
                           <urn:UniqueName>${data.mcccode}</urn:UniqueName>
                        </urn:CommonCommodityCode>
                        <urn:Description>${data.description}</urn:Description>
                        <urn:Price>
                           <urn:Amount>${data.price}</urn:Amount>
                           <urn:Currency>
                              <urn:UniqueName>${data.currency}</urn:UniqueName>
                           </urn:Currency>
                        </urn:Price>
                        <urn:SupplierPartAuxiliaryID>${data.auxiliary}</urn:SupplierPartAuxiliaryID>
                        <urn:SupplierPartNumber>${data.supplierpartId}</urn:SupplierPartNumber>
                        <urn:UnitOfMeasure>
                           <urn:UniqueName>${data.uom}</urn:UniqueName>
                        </urn:UnitOfMeasure>
                     </urn:Description>
                     <urn:ImportedAccountCategoryStaging>
                        <urn:UniqueName>Z</urn:UniqueName>
                     </urn:ImportedAccountCategoryStaging>
                     <urn:ImportedAccountingsStaging>
                        <urn:SplitAccountings>
                           <urn:item>
                              <urn:CostCenter>
                                 <urn:CompanyCode>
                                    <urn:UniqueName>D075</urn:UniqueName>
                                 </urn:CompanyCode>
                                 <urn:UniqueName>CN01000G</urn:UniqueName>
                              </urn:CostCenter>
                              <urn:NumberInCollection>1</urn:NumberInCollection>
                              <urn:Percentage>100</urn:Percentage>
                              <urn:ProcurementUnit>
                                 <urn:UniqueName>WMSC</urn:UniqueName>
                              </urn:ProcurementUnit>
                              <urn:Quantity>${data.quantity}</urn:Quantity>
                           </urn:item>
                        </urn:SplitAccountings>
                        <urn:Type>
                           <urn:UniqueName>_Percentage</urn:UniqueName>
                        </urn:Type>
                     </urn:ImportedAccountingsStaging>
                     <urn:ImportedDeliverToStaging>test_D0r00ag</urn:ImportedDeliverToStaging>
                     <urn:ImportedLineCommentStaging>false</urn:ImportedLineCommentStaging>
                     <urn:ImportedLineExternalCommentStaging>false</urn:ImportedLineExternalCommentStaging>
                     <urn:ImportedNeedByStaging>2020-12-01T00:00:00</urn:ImportedNeedByStaging>
                     <urn:ItemCategory>
                        <urn:UniqueName>Standard</urn:UniqueName>
                     </urn:ItemCategory>
                     <urn:NumberInCollection>1</urn:NumberInCollection>
                     <urn:OriginatingSystemLineNumber>1</urn:OriginatingSystemLineNumber>
                     <urn:PurchaseGroup>
                        <urn:UniqueName>D10</urn:UniqueName>
                     </urn:PurchaseGroup>
                     <urn:PurchaseOrg>
                        <urn:UniqueName>CN01</urn:UniqueName>
                     </urn:PurchaseOrg>
                     <urn:Quantity>${data.quantity}</urn:Quantity>
                     <urn:ShipTo>
                        <urn:UniqueName>H54L</urn:UniqueName>
                     </urn:ShipTo>
                     <urn:Supplier>
                        <urn:UniqueName>${supplier}</urn:UniqueName>
                     </urn:Supplier>
                     <urn:SupplierLocation>
                     <urn:ContactID>1000174002</urn:ContactID>
                     <urn:UniqueName>${supplier}</urn:UniqueName>
                     </urn:SupplierLocation>
                  </urn:item>
`;

    return createItem;
}