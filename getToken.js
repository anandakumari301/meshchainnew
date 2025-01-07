import fs from "fs/promises";
import readline from "readline/promises";
import { logger } from "./logger.js";
import { solveAntiCaptcha } from "./utils/solver.js";
import { coday } from "./scripts.js";

const tokenPath = "newTokens.txt";
const accountsPath = "accounts.txt";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function readAccounts() {
  try {
    let data = await fs.readFile("accounts.txt", "utf-8"); // Read file as UTF-8
    data = data.replace(/\r/g, "").split("\n").filter(Boolean); // Process the data
    return data; // Return the processed data
  } catch (error) {
    return []; // Return an empty array on error
  }
}

async function login(email, password, apiKey) {
  try {
    const captchaToken = await solveAntiCaptcha(apiKey);
    const payloadLogin = {
      captcha_token: captchaToken,
      email: email,
      password: password,
    };

    const response = await coday(
      "https://api.meshchain.ai/meshmain/auth/email-signin",
      "POST",
      {
        "Content-Type": "application/json",
      },
      payloadLogin
    );

    if (response && response.access_token) {
      logger(`Login successful for ${email}!`, "success");
      return response;
    } else {
      logger(`Login failed for ${email}. Check your credentials or captcha.`, "error");
      return null;
    }
  } catch (error) {
    logger(`Error during login for ${email}: ${error.message}`, "error");
    return null;
  }
}

const getTokens = async () => {
  try {
    const accounts = await readAccounts();
    logger(`Found ${accounts.length} accounts from accounts.txt file`);
    const apiKey = await rl.question("Enter ApiKey from Anti-Captcha: ");
    for (const line of accounts) {
      const [email, password] = line.split("|");

      try {
        logger(`Trying to login with account: ${email}`);
        const loginData = await login(email, password, apiKey);
        if (loginData) {
          await fs.appendFile(tokenPath, `${loginData.access_token}|${loginData.refresh_token}\n`, "utf-8");
          logger(`Tokens saved for account ${email} in ${tokenPath} file.`, "success");
        } else {
          logger(`Login failed for account ${email}`, "error");
        }
      } catch (error) {
        logger(`Error logging in with account ${email}: ${error.message}`, "error");
      }
    }
  } catch (error) {
    logger(`Error processing accounts: ${error.message}`, "error");
  } finally {
    rl.close();
  }
};

getTokens();
