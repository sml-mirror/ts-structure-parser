export import helpers = require("./src/helpers");
import tsStructureParser = require("./src/tsStructureParser");

export interface Module {
    classes: ClassModel[];
    functions: FunctionDeclaration[];
    imports: { [name: string]: Module};
    _imports: ImportNode[];
    aliases: AliasNode[];
    enumDeclarations: EnumDeclaration[];
    name: string;
}

export interface FunctionDeclaration {
    name: string;
    isAsync: boolean; 
    isArrow: boolean;
    isExport: boolean;
    // returnType?: ReturnTypeDeclaration;
    params?: {
        name: string,
        type: string,
        mandatory: boolean;
    }[];
}


export interface ReturnTypeDeclaration {
    isPromise?: boolean;
    isArray?: boolean;
    isUnion?: boolean;
    isLiteral?: boolean;
    value?: any;
    type: string | ReturnTypeDeclaration[] | undefined;

}
export interface AliasNode {
    name: string;
    type: TypeModel;
}

export interface ImportNode {
    clauses: string[];
    absPathNode: string[];
    absPathString: string;
    isNodeModule: boolean;
}

export class EnumMemberDeclaration {
  name: string;
  value?: number | string;
}

export class EnumDeclaration {
    name: string;
    members: EnumMemberDeclaration[];
}

export enum TypeKind {
    BASIC,
    ARRAY,
    UNION
}

export type TypeModel = BasicType | ArrayType | UnionType;

export interface BasicType {
    typeKind: TypeKind.BASIC;
    nameSpace: string;
    basicName: string;
    typeName: string;
    typeArguments: TypeModel[];
    modulePath: string;
}

export interface ArrayType {
    typeKind: TypeKind.ARRAY;
    base: TypeModel;
}

export type Arg = string | number | boolean;

export interface UnionType {
    typeKind: TypeKind.UNION;
    options: TypeModel[];
}

export interface Annotation {
    name: string;
    arguments: (Arg|Arg[])[];
}

export interface Decorator {
    name: string;
    arguments: (Arg|Arg[])[];
}


export interface FieldModel {
    name: string;
    type: TypeModel;
    decorators: Decorator[];
    annotations: Annotation[];
    valueConstraint: Constraint;
    optional: boolean;
}

export interface MethodModel {
    start: number;
    end: number;
    name: string;
    text: string;
    returnType: TypeModel;
    arguments: ParameterModel[];
}

export interface ParameterModel {
    start: number;
    end: number;
    name: string;
    text: string;
    type: TypeModel;
}

export interface Constraint {
    isCallConstraint: boolean;
    value?: any;
}

export interface CallConstraint extends Constraint {
    value: Annotation;
}

export interface ValueConstraint extends Constraint {
    value: string|number|boolean;
}

export interface ClassModel {
    name: string;

    decorators: Decorator[];
    annotations: Annotation[];
    moduleName: string;
    extends: TypeModel[];
    implements: TypeModel[];

    fields: FieldModel[];

    methods: MethodModel[];

    typeParameters: string[];
    typeParameterConstraint: string[];
    isInterface: boolean;
    annotationOverridings: {[key: string]: Annotation[]};
}

export function classDecl(name: string, isInteface: boolean): ClassModel {
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

export function parseStruct(content: string, modules: {[path: string]: Module}, mpth: string): Module {
    return tsStructureParser.parseStruct(content, modules, mpth);
}
