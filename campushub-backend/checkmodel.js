import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDq7c3ZxFht1uPhqATp5sTGeCB9FdO3vX4");

async function checkModels() {
  const models = await genAI.listModels();
  console.log(models);
}

checkModels();