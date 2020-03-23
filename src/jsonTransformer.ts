export class JSONTransformer {
    public static unique(arr: string[]): string[] {
        let obj = {};
        for (var i = 0; i < arr.length; i++) {
          var str = arr[i];
          obj[str] = true;
        }
        return Object.keys(obj);
    }

    public static toValidateView( obj: any ): string {
        // delete all ' and replace it to "
        let  jsonString = obj.getFullText().split("\'").join("\"");
        let matches = jsonString.match(/ [\w]+.[\w]+\(\)/);
        if (matches && matches.length) {
            matches.forEach(match => {
                jsonString = jsonString.replace(match, `"${match}"`);
            });
        }
        // make all keys without "" to keys with ""
        let regExp = / ?[a-zA-Z]\w+(\.\w+)?(\s)*:/g;
        let m = jsonString.match(regExp);
        if (m) {
            m = m.map(item => {
                return item.trim().replace(":", "");
            });
            m = JSONTransformer.unique(m);
            m.forEach(match => {
                if (!(match.match(/ ?(true|false)[ ,}]?/))) {
                    let reg = new RegExp(match, "g");
                    let replaceWord = "\"" + match.substring(0 , match.length) + "\"" ;
                    jsonString = jsonString.replace(reg, replaceWord);
                }
            });
        }

        // make all value like function in branches
        regExp = /: ?[a-zA-Z]\w+(\.\w+)?/g;
        m = jsonString.match(regExp);
        if (m) {
            m = m.map(item => {
                return item.substring(1).trimLeft();
            });
            m = JSONTransformer.unique(m);
            m.forEach(match => {
                if (!(match.match(/ ?(true|false)[ ,}]?/))) {
                    let reg = new RegExp(match, "g");
                    let replaceWord = "\"" + match.substring(0 , match.length) + "\"" ;
                    jsonString = jsonString.replace(reg, replaceWord);
                }
            });
        }
        return jsonString;
    }
}