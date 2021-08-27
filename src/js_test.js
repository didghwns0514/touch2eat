function callback_giver_1() {
  let _var1 = "hi";
  let _var2 = "its me";
  let _var3 = "bye!";
  let func_1 = function (var1, var2, var3) {
    console.log("func1 var1 : ", var1);
    console.log("func1 var2 : ", var2);
    console.log("func1 var3 : ", var3);
  };
  return func_1(_var1, _var2, _var3);
}

let callback_caller = (got_1, got_2, got_3, got_4) => {
  console.log("callback_caller got_1 : ", got_1);
  console.log("callback_caller got_2 : ", got_2);
  console.log("callback_caller got_3 : ", got_3);
  console.log("callback_caller got_4 : ", got_4);
};

callback_caller(callback_giver_1);
