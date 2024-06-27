class Person {
    public name:string;//写或什么都不写都是public
    public age:number;

    constructor(name:string,age:number) {
        this.name=name//可以在类中修改
        this.age=age
    }
    sayHello():void{
        console.log(`大家好,我是${this.name}` );
    }
}
class Employee1 extends Person{
    sayHello(): void {
        super.sayHello()//调用父类的函数
    }
}
class Employee2 extends Person{
    constructor(name:string,age:number){
        super(name,age)
    }
}
const p=new Person('张三',18)
p.sayHello()