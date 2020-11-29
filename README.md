# another-xml2json
 
## What is another-xml2json

another-xml2json is another JavaScript package for converting xml to json. We used another package another-xml-parser, refer to https://www.npmjs.com/package/another-xml-parser

## Install

``` CMD
npm install another-xml2json --save
```

## Parameters
``` Typescript
interface IOptions {
    /**
     * escape
     */
    escape?: boolean;
    /**
     * arrayNodes, decides which level of nodes are array
     */
    arrayNodes?: RegExp[];
}

/**
 *
 * @param xml the xml you convert
 * @param options the options
 * @param transpile the callback of transpile each node
 */
declare function xml2json(xml: string, options?: IOptions, transpile?: Function | undefined): any;
```


## Usage

``` Typescript
import { xml2json } from 'another-xml2json'

const sample = `
<?xml version="1.0" encoding="UTF-8" ?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempurl.org/"
    xmlns:ent="http://schemas.datacontract.org/2004/07/ent.Entities"
    xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:GetData >
        <tem:sessionId>XXXXX</tem:sessionId>
        <tem:requestData>
          <ent:foo>foo</ent:foo>
          <ent:bar>bar&gt;</ent:bar>
          <ent:empty/>
          <ent:tata i:nil="true"/>
          <ent:bars>
            <arr:string>bar1</arr:string>
            <arr:string/>
          </ent:bars>
          <ent:numbers>
            <arr:number>1</arr:number>
            <arr:number>2</arr:number>
          </ent:numbers>
          <ent:booleans>
            <arr:boolean>true</arr:boolean>
            <arr:boolean>false</arr:boolean>
          </ent:booleans>
          <ent:cars>
            <ent:car>
              <ent:name>car1</ent:name>
              <ent:brand>Volkswagen</ent:brand>
            </ent:car>
            <ent:car>
              <ent:name>car2&lt;&gt;&amp;&quot;&apos;&lt;&gt;&amp;&quot;&apos;</ent:name>
              <ent:brand>BMW</ent:brand>
            </ent:car>
          </ent:cars>
        </tem:requestData>
      </tem:GetData>
    </soapenv:Body>
  </soapenv:Envelope>
`

const res = xml2json(sample, {
  escape: true,
  arrayNodes: [
    /requestData\.bars$/,
    /GetData\.requestData\.numbers$/,
    /requestData\.booleans$/,
    /Envelope.[\S]+.requestData.cars$/
  ]
}, (val: any, xmlNode: XmlNode) => {
  return val
})

console.log(JSON.stringify(res))
```

Output:

``` JSON
{
  "Envelope": {
    "Header": "",
    "Body": {
      "GetData": {
        "sessionId": "XXXXX",
        "requestData": {
          "foo": "foo",
          "bar": "bar>",
          "empty": "",
          "tata": null,
          "bars": [
            "bar1",
            ""
          ],
          "numbers": [
            1,
            2
          ],
          "booleans": [
            true,
            false
          ],
          "cars": [
            {
              "name": "car1",
              "brand": "Volkswagen"
            },
            {
              "name": "car2<>&\"'<>&\"'",
              "brand": "BMW"
            }
          ]
        }
      }
    }
  }
}
```
