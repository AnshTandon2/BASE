import Main from "./main.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

let key = -1;

await fetch("key.txt")
  .then((res) => res.text())
  .then((text) => {
    key = text;
   })
  .catch((e) => console.error(e));

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: { functionDeclarations: Main.functionDeclarations },
  toolConfig: {
    functionCallingConfig: {
      mode: "AUTO"
    }
  }
});

async function pipeline(prompt) {
  const chat = model.startChat();
  const result = await chat.sendMessage(prompt);
  const calls = result.response.functionCalls();
  console.log(calls);

  if (calls.length > 0) {
    for (const call of calls) {
      Main.functionMap[call.name](call.args);
    }
  }
  else {
    Main.noFunction();
  }
}

function submitHandler(e) {
  e.preventDefault();
  pipeline(document.getElementById('main').value);
}
document.getElementById("container").addEventListener('submit', submitHandler);
