import {ClassDecorator, ClassDecoratorWithParam}  from "../decorator/decorator";
import {
    FieldDecorator,
    FieldDecoratorWithParam,
    FieldDecoratorWith2Params,
    FieldDecoratorWithFuncParam,
    FieldDecoratorWithAnyParam} from "../decorator/decorator";
import {testFunction, TestClassWithFunc}  from "./testFunction";
import { } from "grunt";

@ClassDecorator()
@ClassDecoratorWithParam("HeroDetailClass")
export class HeroDetail {

    public id?: number;

    @FieldDecorator()
    @FieldDecoratorWithAnyParam({
        paramUno: "123",
        paramDos: false,
        paramTres:
            {
                paramUno: 15,
                paramDos: "quatro",
                "paramsTre": false,
                paramsFour: testFunction,
                paramsFive: TestClassWithFunc.func
            }
        })
    public detail: string;
}

@ClassDecorator()
@ClassDecoratorWithParam("HeroClass")
@FieldDecoratorWithAnyParam({
    samenameintitle: 1,
    secondItem: "samenameintitle/22"
})
@FieldDecoratorWithAnyParam({
    nullable: true,
    secondItem: null
})
export class Hero {

    @FieldDecoratorWithParam("int, primary key")
    @FieldDecorator()
    public id: number;

    @FieldDecoratorWith2Params("string", { "required": true, "max-length": 128, "min-length": 5})
    public name: string;


    @FieldDecoratorWithParam("external reference")
    @FieldDecorator()
    public detail: HeroDetail;

    @FieldDecoratorWithParam("array of objects from external reference")
    @FieldDecorator()
    public details: HeroDetail[];

    @FieldDecorator()
    @FieldDecoratorWithFuncParam(() => { console.log("function"); })
    @FieldDecoratorWithFuncParam(testFunction)
    public simpleArray: number[];
}
