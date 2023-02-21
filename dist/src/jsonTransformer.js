"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONTransformer {
    static unique(arr) {
        let obj = {};
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            obj[str] = true;
        }
        return Object.keys(obj);
    }
    static toValidateView(obj) {
        let jsonString = obj.getFullText().split("\'").join("\"");
        let matches = jsonString.match(/ [\w]+.[\w]+\(\)/);
        if (matches && matches.length) {
            matches.forEach(match => {
                jsonString = jsonString.replace(match, `"${match}"`);
            });
        }
        let regExp = / ?[a-zA-Z]\w+(\.\w+)?(\s)*:/g;
        let m = jsonString.match(regExp);
        if (m) {
            m = m.map(item => {
                return item.trim();
            });
            m = JSONTransformer.unique(m);
            m.forEach(match => {
                if (!(match.match(/ ?(true|false)[ ,}]?/))) {
                    let reg = new RegExp(match, "g");
                    let replaceWord = `"${match.substring(0, match.length - 1).trim()}":`;
                    jsonString = jsonString.replace(reg, replaceWord);
                }
            });
        }
        regExp = /:(\s)*?[a-zA-Z]\w+(\.\w+)?/g;
        m = jsonString.match(regExp);
        if (m) {
            m = m.map(item => {
                return item.trim();
            });
            m = JSONTransformer.unique(m);
            m.forEach(match => {
                if (!(match.match(/ ?(true|false)[ ,}]?/))) {
                    let reg = new RegExp(match, "g");
                    let replaceWord = `: "${match.substring(1, match.length).trim()}"`;
                    jsonString = jsonString.replace(reg, replaceWord);
                }
            });
        }
        return jsonString;
    }
}
exports.JSONTransformer = JSONTransformer;
//# sourceMappingURL=jsonTransformer.js.map