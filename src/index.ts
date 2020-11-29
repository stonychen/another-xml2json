import { XmlNode, parseXml } from 'another-xml-parser'

interface IOptions {
  /**
   * escape
   */
  escape?: boolean

  /**
   * arrayNodes, decides which level of nodes are array
   */
  arrayNodes?: RegExp[]
}

/**
 * Walk the tree of xmlNodes
 * @param xmlNode 
 * @param options 
 * @param transpile 
 * @param isRoot 
 */
function walk(xmlNode: XmlNode, options: IOptions = {}, transpile: Function | undefined = undefined, isRoot = false) {


  let isArr = options && options.arrayNodes ?
    (options.arrayNodes as RegExp[]).some(m => m.test(xmlNode.path))
    : false

  let val: any = isArr ? [] : {}

  if (xmlNode.children.length > 0) {
    xmlNode.children.map(child => {
      const subData = walk(child, options, transpile)
      if (isArr) {
        (val as any[]).push(subData)
      } else {
        (val as any)[child.name] = subData
      }
    })

  } else {

    val = isArr ? [] : xmlNode.text

    if (xmlNode.tag === "arr:number") {
      val = Number(xmlNode.text)
    } else if (xmlNode.tag === "arr:boolean") {
      val = ("" + xmlNode.text).toLowerCase() === 'true'
    } else if (xmlNode.tag === "arr") {
      val = xmlNode.text
    } else if (Object.getOwnPropertyNames(xmlNode.attrs)
      .some(attr =>
        /:nil=true/.test(attr + "=" + xmlNode.attrs[attr]))
    ) {
      val = null
    }
    if (transpile) {
      val = transpile(val, xmlNode)
    }
  }
  if (isRoot) {
    const root = {};
    (root as any)[xmlNode.name] = val
    return root
  } else
    return val
}


/**
 * Convert xml to json
 * @param xml the xml you will convert
 * @param options the options
 * @param transpile the callback of transpile each node
 */
function xml2json(xml: string, options: IOptions = {}, transpile: Function | undefined = undefined) {
  const root = parseXml(xml, options)

  const json = root ? walk(root, options, transpile, true) : undefined

  return json
}


export { xml2json }
