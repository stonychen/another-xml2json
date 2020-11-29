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
 * Convert xml to json
 * @param xml the xml you will convert
 * @param options the options
 * @param transpile the callback of transpile each node
 */
declare function xml2json(xml: string, options?: IOptions, transpile?: Function | undefined): any;
export { xml2json };
