var objectProto = {
  x:45
}

var obj = Object.create(objectProto);
console.log(obj.x);


var Person = {
  constructor:function(name, age, gender){
    this.name = name||"hwo"
    this.age = age;//|15;
    this.gender = gender||"male";
    return this;
  },

  greet:function(){
    console.log("hello, my name is "+this.name);
  },
  my_age:function(){
      console.log("I am "+this.age+" old");
  }
}


var Vasya = Object.create(Person).constructor("",35,"");
Vasya.greet();
Vasya.my_age();
