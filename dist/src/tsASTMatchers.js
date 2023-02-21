"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
var Matching;
(function (Matching) {
    class BasicMatcher {
        match(node) {
            throw new Error();
        }
        nodeType() {
            throw new Error();
        }
        doMatch(n) {
            if (!n) {
                return null;
            }
            if (this.nodeType() === n.kind) {
                return this.match(n);
            }
        }
    }
    Matching.BasicMatcher = BasicMatcher;
    class ClassDeclarationMatcher extends BasicMatcher {
        constructor() {
            super();
        }
        match(node) {
            return node;
        }
        nodeType() {
            return ts.SyntaxKind.ClassDeclaration;
        }
    }
    Matching.ClassDeclarationMatcher = ClassDeclarationMatcher;
    class FieldMatcher extends BasicMatcher {
        match(node) {
            return node;
        }
        nodeType() {
            return ts.SyntaxKind.PropertyDeclaration;
        }
    }
    Matching.FieldMatcher = FieldMatcher;
    class AssignmentExpressionMatcher extends BasicMatcher {
        constructor(left, right, tr) {
            super();
            this.left = left;
            this.right = right;
            this.tr = tr;
        }
        match(node) {
            if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                if (this.left.doMatch(node.left) && this.right.doMatch(node.right)) {
                    return this.tr(node);
                }
            }
            return null;
        }
        nodeType() {
            return ts.SyntaxKind.BinaryExpression;
        }
    }
    Matching.AssignmentExpressionMatcher = AssignmentExpressionMatcher;
    class VariableDeclarationMatcher extends BasicMatcher {
        constructor(left, right, tr) {
            super();
            this.left = left;
            this.right = right;
            this.tr = tr;
        }
        match(node) {
            if (this.left.doMatch(node.name) && this.right.doMatch(node.initializer)) {
                return this.tr(node);
            }
        }
        nodeType() {
            return ts.SyntaxKind.VariableDeclaration;
        }
    }
    Matching.VariableDeclarationMatcher = VariableDeclarationMatcher;
    class ExpressionStatementMatcher extends BasicMatcher {
        constructor(expression, tr) {
            super();
            this.expression = expression;
            this.tr = tr;
        }
        match(node) {
            var exp = this.expression.doMatch(node.expression);
            if (exp) {
                var v = this.tr(node.expression);
                if (v === true) {
                    return exp;
                }
                return v;
            }
            return null;
        }
        nodeType() {
            return ts.SyntaxKind.ExpressionStatement;
        }
    }
    class SimpleIdentMatcher extends BasicMatcher {
        constructor(val) {
            super();
            this.val = val;
        }
        match(node) {
            if (node.text === this.val) {
                return true;
            }
            return null;
        }
        nodeType() {
            return ts.SyntaxKind.Identifier;
        }
    }
    class TrueMatcher {
        doMatch(node) {
            return true;
        }
        nodeType() {
            return null;
        }
    }
    class CallExpressionMatcher extends BasicMatcher {
        constructor(calleeMatcher, tr) {
            super();
            this.calleeMatcher = calleeMatcher;
            this.tr = tr;
        }
        match(node) {
            if (this.calleeMatcher.doMatch(node.expression)) {
                return this.tr(node);
            }
            return null;
        }
        nodeType() {
            return ts.SyntaxKind.CallExpression;
        }
    }
    Matching.SKIP = {};
    function visit(n, cb) {
        var r0 = cb(n);
        if (r0) {
            if (r0 === Matching.SKIP) {
                return null;
            }
            return r0;
        }
        var r = ts.forEachChild(n, x => {
            var r = visit(x, cb);
            if (r) {
                return r;
            }
        });
        return r;
    }
    Matching.visit = visit;
    class PathNode {
        constructor(name, _base) {
            this._base = _base;
            this.arguments = null;
            this.name = name;
        }
    }
    Matching.PathNode = PathNode;
    class CallPath {
        constructor(base, _baseNode) {
            this._baseNode = _baseNode;
            this.path = [];
            this.base = base;
        }
        start() {
            return this._baseNode.pos;
        }
        startLocation() {
            return this._baseNode.getSourceFile().getLineAndCharacterOfPosition(this.start());
        }
        endLocation() {
            return this._baseNode.getSourceFile().getLineAndCharacterOfPosition(this.end());
        }
        end() {
            var ce = this.path[this.path.length - 1]._callExpression;
            if (ce) {
                return ce.end;
            }
            return this.start();
        }
        toString() {
            return this.path.map(x => x.name).join(".");
        }
    }
    Matching.CallPath = CallPath;
    class MemberExpressionMatcher extends BasicMatcher {
        constructor(objectMatcher, propertyMatcher, tr) {
            super();
            this.objectMatcher = objectMatcher;
            this.propertyMatcher = propertyMatcher;
            this.tr = tr;
        }
        match(node) {
            if (this.objectMatcher.doMatch(node.expression) && this.propertyMatcher.doMatch(node.name)) {
                return this.tr(node);
            }
            return null;
        }
        nodeType() {
            return ts.SyntaxKind.PropertyAccessExpression;
        }
    }
    function memberFromExp(objMatcher, tr = x => true) {
        var array = objMatcher.split(".");
        var result = null;
        for (var a = 0; a < array.length; a++) {
            var arg = array[a];
            var ci = arg.indexOf("(*)");
            var isCall = false;
            if (ci !== -1) {
                arg = arg.substr(0, ci);
                isCall = true;
            }
            if (result == null) {
                result = arg === "*" ? anyNode() : ident(arg);
            }
            else {
                result = new MemberExpressionMatcher(result, arg === "*" ? anyNode() : ident(arg), tr);
            }
            if (isCall) {
                result = new CallExpressionMatcher(result, tr);
            }
        }
        return result;
    }
    Matching.memberFromExp = memberFromExp;
    class CallBaseMatcher {
        constructor(rootMatcher) {
            this.rootMatcher = rootMatcher;
        }
        doMatch(node) {
            var original = node;
            if (node.kind === ts.SyntaxKind.CallExpression) {
                var call = node;
                var res = this.doMatch(call.expression);
                if (res) {
                    if (res.path.length > 0 && res.path[res.path.length - 1].arguments == null) {
                        res.path[res.path.length - 1].arguments = call.arguments;
                        res.path[res.path.length - 1]._callExpression = call;
                        return res;
                    }
                    return null;
                }
            }
            else if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
                var me = node;
                var v = this.doMatch(me.expression);
                if (v) {
                    if (me.name.kind === ts.SyntaxKind.Identifier) {
                        v.path.push(new PathNode(me.name.text, me.name));
                        return v;
                    }
                    return null;
                }
            }
            else if (node.kind === ts.SyntaxKind.Identifier) {
                var id = node;
                if (this.rootMatcher.doMatch(id)) {
                    return new CallPath(id.text, id);
                }
            }
            return null;
        }
        nodeType() {
            return null;
        }
    }
    Matching.CallBaseMatcher = CallBaseMatcher;
    function ident(name) {
        return new SimpleIdentMatcher(name);
    }
    Matching.ident = ident;
    function anyNode() {
        return new TrueMatcher();
    }
    Matching.anyNode = anyNode;
    function call(calleeMatcher, tr = x => true) {
        return new CallExpressionMatcher(calleeMatcher, tr);
    }
    Matching.call = call;
    function exprStmt(eM, tr = x => true) {
        return new ExpressionStatementMatcher(eM, tr);
    }
    Matching.exprStmt = exprStmt;
    function assign(left, right, tr = x => true) {
        return new AssignmentExpressionMatcher(left, right, tr);
    }
    Matching.assign = assign;
    function varDecl(left, right, tr = x => true) {
        return new VariableDeclarationMatcher(left, right, tr);
    }
    Matching.varDecl = varDecl;
    function field() {
        return new FieldMatcher();
    }
    Matching.field = field;
    function classDeclaration() {
        return new ClassDeclarationMatcher();
    }
    Matching.classDeclaration = classDeclaration;
})(Matching = exports.Matching || (exports.Matching = {}));
//# sourceMappingURL=tsASTMatchers.js.map