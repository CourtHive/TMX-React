import { clearHistory } from 'functions/browser';

const queryString = {};

export function parse() {
    // eslint-disable-next-line
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i=0;i<vars.length;i++) {
        let pair = vars[i].split("=");
        if (typeof queryString[pair[0]] === "undefined") {
            queryString[pair[0]] = pair[1];
        } else if (typeof queryString[pair[0]] === "string") {
            let arr = [ queryString[pair[0]], pair[1] ];
            queryString[pair[0]] = arr;
        } else {
            queryString[pair[0]].push(pair[1]);
        }
    } 
    clearHistory();
    return queryString;
}
