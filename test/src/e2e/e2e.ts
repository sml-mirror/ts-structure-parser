"use strict";

import * as fs from "fs";
import {} from "mocha";

import {Module} from "../../../index" ;
import {parseStruct} from "../../../src/tsStructureParser";
import {expect} from "chai";


describe("E2E Tests", () => {

      it("Hero", (done) => {
        let filePath: string = "./test/src/model/hero/hero.ts";
        let structPath: string = "./test/src/model/hero/hero.json";

        let decls = fs.readFileSync(filePath).toString();
        let parsedStructure: Module = parseStruct(decls, {}, filePath);
        let expectedStruct: any = JSON.parse(fs.readFileSync(structPath, "utf8"));
        expect(parsedStructure).be.deep.equal(expectedStruct);

          done();
      });

      it("Function", (done) => {
        let filePath: string = "./test/src/model/hero/testFunction.ts";
        let expectedFunc: string = "./test/src/model/hero/testFunction.json";

        let decls = fs.readFileSync(filePath).toString();
        let parsedStructure: Module = parseStruct(decls, {}, filePath);
        const functions = parsedStructure.functions;
        let expectedStruct: any = JSON.parse(fs.readFileSync(expectedFunc, "utf8"));
        expect(functions).be.deep.equal(expectedStruct);
        done();
      });

});
