"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = require("./src/helpers");
const tsStructureParser = require("./src/tsStructureParser");
class EnumMemberDeclaration {
}
exports.EnumMemberDeclaration = EnumMemberDeclaration;
class EnumDeclaration {
}
exports.EnumDeclaration = EnumDeclaration;
var TypeKind;
(function (TypeKind) {
    TypeKind[TypeKind["BASIC"] = 0] = "BASIC";
    TypeKind[TypeKind["ARRAY"] = 1] = "ARRAY";
    TypeKind[TypeKind["UNION"] = 2] = "UNION";
})(TypeKind = exports.TypeKind || (exports.TypeKind = {}));
function classDecl(name, isInteface) {
    return {
        name: name,
        methods: [],
        typeParameters: [],
        typeParameterConstraint: [],
        implements: [],
        fields: [],
        isInterface: isInteface,
        decorators: [],
        annotations: [],
        extends: [],
        moduleName: null,
        annotationOverridings: {}
    };
}
exports.classDecl = classDecl;
function parseStruct(content, modules, mpth) {
    return tsStructureParser.parseStruct(content, modules, mpth);
}
exports.parseStruct = parseStruct;
//# sourceMappingURL=index.js.map