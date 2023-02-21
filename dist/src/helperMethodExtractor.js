"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const tsm = require("./tsASTMatchers");
const path = require("path");
const fs = require("fs");
const tsStructureParser = require("./tsStructureParser");
const helpers_1 = require("./helpers");
function getHelperMethods(srcPath) {
    var result = [];
    var content = fs.readFileSync(path.resolve(srcPath)).toString();
    var mod = ts.createSourceFile("sample.ts", content, ts.ScriptTarget.ES3, true);
    tsm.Matching.visit(mod, x => {
        var node = x;
        if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
            var meta = getMeta(node, content);
            if (!meta) {
                return;
            }
            var originalName = node.name.text;
            var wrapperMethodName = originalName;
            if (meta.name) {
                wrapperMethodName = meta.name;
            }
            else {
                meta.name = originalName;
            }
            wrapperMethodName = meta.name ? meta.name : originalName;
            var args = node.parameters ? node.parameters.map(a => readArg(a, srcPath)) : [];
            var override = meta.override ? meta.override : false;
            var returnType = tsStructureParser.buildType(node.type, srcPath);
            result.push(new helpers_1.HelperMethod(originalName, wrapperMethodName, returnType, args, meta));
        }
    });
    return result;
}
exports.getHelperMethods = getHelperMethods;
var refineComment = function (comment) {
    return comment.replace(/^\s*\/\*+/g, "").replace(/\*+\/\s*$/g, "").split("\n")
        .map(x => x.replace(/^\s*\/\//g, "").replace(/^\s*\* {0,1}/g, "")).join("\n").trim();
};
function getMeta(node, content) {
    var cRange = ts.getLeadingCommentRanges(content, node.pos);
    if (!cRange) {
        return null;
    }
    var comment = cRange.map(x => content.substring(x.pos, x.end)).join("\n");
    var ind = comment.indexOf("__$helperMethod__");
    if (ind < 0) {
        return null;
    }
    ind += "__$helperMethod__".length;
    var indMeta = comment.indexOf("__$meta__");
    if (indMeta < 0) {
        return { comment: refineComment(comment.substring(ind)) };
    }
    var commentStr = refineComment(comment.substring(ind, indMeta));
    var indMetaObj = comment.indexOf("{", indMeta);
    if (indMetaObj < 0) {
        return { comment: commentStr };
    }
    try {
        var meta = JSON.parse(refineComment(comment.substring(indMetaObj)));
        meta.comment = commentStr.trim().length > 0 ? commentStr : null;
        meta.override = meta.override || false;
        meta.primary = meta.primary || false;
        meta.deprecated = meta.deprecated || false;
        return meta;
    }
    catch (e) {
        console.log(e);
    }
    return {};
}
function readArg(node, srcPath) {
    var name = node.name.text;
    var type = tsStructureParser.buildType(node.type, srcPath);
    var defaultValue;
    var optional = node.questionToken != null;
    if (node.initializer != null) {
        defaultValue = tsStructureParser.parseArg(node.initializer);
        optional = true;
    }
    return {
        name: name,
        type: type,
        defaultValue: defaultValue,
        optional: optional
    };
}
//# sourceMappingURL=helperMethodExtractor.js.map