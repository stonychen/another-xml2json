"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xml2json = void 0;
var another_xml_parser_1 = require("another-xml-parser");
/**
 * Walk the tree of xmlNodes
 * @param xmlNode
 * @param options
 * @param transpile
 * @param isRoot
 */
function walk(xmlNode, options, transpile, isRoot) {
    if (options === void 0) { options = {}; }
    if (transpile === void 0) { transpile = undefined; }
    if (isRoot === void 0) { isRoot = false; }
    var isArr = options && options.arrayNodes ?
        options.arrayNodes.some(function (m) { return m.test(xmlNode.path); })
        : false;
    var val = isArr ? [] : {};
    if (xmlNode.children.length > 0) {
        xmlNode.children.map(function (child) {
            var subData = walk(child, options, transpile);
            if (isArr) {
                val.push(subData);
            }
            else {
                val[child.name] = subData;
            }
        });
    }
    else {
        val = isArr ? [] : xmlNode.text;
        if (xmlNode.tag === "arr:number") {
            val = Number(xmlNode.text);
        }
        else if (xmlNode.tag === "arr:boolean") {
            val = ("" + xmlNode.text).toLowerCase() === 'true';
        }
        else if (xmlNode.tag === "arr") {
            val = xmlNode.text;
        }
        else if (Object.getOwnPropertyNames(xmlNode.attrs)
            .some(function (attr) {
            return /:nil=true/.test(attr + "=" + xmlNode.attrs[attr]);
        })) {
            val = null;
        }
        if (transpile) {
            val = transpile(val, xmlNode);
        }
    }
    if (isRoot) {
        var root = {};
        root[xmlNode.name] = val;
        return root;
    }
    else
        return val;
}
/**
 * Convert xml to json
 * @param xml the xml you will convert
 * @param options the options
 * @param transpile the callback of transpile each node
 */
function xml2json(xml, options, transpile) {
    if (options === void 0) { options = {}; }
    if (transpile === void 0) { transpile = undefined; }
    var root = another_xml_parser_1.parseXml(xml, options);
    var json = root ? walk(root, options, transpile, true) : undefined;
    return json;
}
exports.xml2json = xml2json;
