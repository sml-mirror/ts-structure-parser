"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index = require("../index");
const helperMethodExtractor = require("./helperMethodExtractor");
var ns = { "RamlWrapper": true };
class HelperMethod {
    constructor(originalName, wrapperMethodName, returnType, args, meta) {
        this.originalName = originalName;
        this.wrapperMethodName = wrapperMethodName;
        this.returnType = returnType;
        this.args = args;
        this.meta = meta;
    }
    targetWrappers() {
        var isValid = true;
        var result = [];
        this.args.forEach(x => {
            var arr = flatten(x.type, ns);
            if (arr.length === 0) {
                return;
            }
            if (!isValid || result.length !== 0) {
                result = [];
                isValid = false;
                return;
            }
            result = result.concat(arr);
        });
        return result;
    }
    callArgs() {
        return this.args.map(x => {
            if (flatten(x.type, ns).length === 0) {
                return x;
            }
            return {
                name: "this",
                type: null,
                optional: false,
                defaultValue: undefined
            };
        });
    }
}
exports.HelperMethod = HelperMethod;
function flatten(t, namespaces) {
    if (t.typeKind === index.TypeKind.ARRAY) {
        if (namespaces) {
            return [];
        }
        else {
            return [flatten(t.base)[0] + "[]"];
        }
    }
    else if (t.typeKind === index.TypeKind.BASIC) {
        var bt = t;
        var str = bt.basicName;
        var nameSpace = bt.nameSpace && bt.nameSpace.trim();
        if (nameSpace && nameSpace.length > 0 && nameSpace !== "RamlWrapper") {
            str = nameSpace + "." + str;
        }
        if (bt.typeArguments && bt.typeArguments.length !== 0) {
            str += `<${bt.typeArguments.map(x => flatten(x)).join(", ")}>`;
        }
        if (namespaces) {
            if (bt.nameSpace) {
                return namespaces[bt.nameSpace] ? [str] : [];
            }
            else {
                return [];
            }
        }
        return [str];
    }
    else if (t.typeKind === index.TypeKind.UNION) {
        var ut = t;
        var result = [];
        ut.options.forEach(x => result = result.concat(flatten(x, namespaces)));
        return result;
    }
    return [];
}
exports.flatten = flatten;
function getHelperMethods(srcPath) {
    return helperMethodExtractor.getHelperMethods(srcPath);
}
exports.getHelperMethods = getHelperMethods;
//# sourceMappingURL=helpers.js.map