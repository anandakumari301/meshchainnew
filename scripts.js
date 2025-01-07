import fetch from "node-fetch";
import { logger } from "./logger.js";
import { HttpsProxyAgent } from "https-proxy-agent";

async function coday(url, method, headers, payloadData = null, proxy = null) {
  try {
    const options = {
      method,
      headers,
    };

    if (payloadData) {
      options.body = JSON.stringify(payloadData);
    }

    if (proxy) {
      const agent = new HttpsProxyAgent(proxy);
      options.agent = agent;
    }

    const response = await fetch(url, options);
    const jsonData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { error: true, status: response.status, data: jsonData };
    }
    return jsonData;
  } catch (error) {
    logger(`Error in coday: ${error.message}`, "error");
    return { error: true, message: error.message };
  }
}

async function estimate(id, headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/rewards/estimate";
  const result = await coday(url, "POST", headers, { unique_id: id }, proxy);

  return result || undefined;
}

async function claim(id, headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/rewards/claim";
  const result = await coday(url, "POST", headers, { unique_id: id }, proxy);
  return result.total_reward || null;
}

async function start(id, headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/rewards/start";
  const result = await coday(url, "POST", headers, { unique_id: id }, proxy);

  return result || null;
}

async function info(id, headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/nodes/status";
  const result = await coday(url, "POST", headers, { unique_id: id }, proxy);

  return result || null;
}

async function infoSpin(headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/lucky-wheel/next-round";
  const result = await coday(url, "GET", headers, null, proxy);

  return result || null;
}

async function doSpin(headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/lucky-wheel/spin";
  const result = await coday(url, "POST", headers, {}, proxy);

  return result || null;
}

async function init(headers, unique_id, proxy) {
  const url = "https://api.meshchain.ai/meshmain/nodes/link";
  const payload = { unique_id, node_type: "browser", name: "Extension" };

  const response = await coday(url, "POST", headers, payload, proxy);
  return response || null;
}

async function rewardInfo(headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/rewards/user";

  const response = await coday(url, "GET", headers, null, proxy);
  return response || null;
}

async function spinInfo(headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/lucky-wheel/next-round/simple";

  const response = await coday(url, "GET", headers, null, proxy);
  return response || null;
}

async function userInfo(headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/user/profile";

  const response = await coday(url, "GET", headers, null, proxy);
  return response || null;
}

async function getTokensInfo(headers, proxy) {
  const url = "https://api.meshchain.ai/meshmain/wallet/tokens";
  const result = await coday(url, "GET", headers, null, proxy);

  return result || null;
}
async function withdraw(to_address, asset_address, usdtAmount, headers, proxy) {
  const payload = {
    to_address,
    asset_address,
    total_amount: usdtAmount,
  };
  const url = "https://api.meshchain.ai/meshmain/withdraw";
  const result = await coday(url, "POST", headers, payload, proxy);

  return result || null;
}

// function addQueryParam() {
//   const url = new URL("https://app.meshchain.ai/connect"); // Get current URL
//   url.searchParams.set("provider", "telegram"); // Add or update the query parameter
//   url.searchParams.set(
//     "code",
//     "dXNlcj0lN0IlMjJpZCUyMiUzQTU0OTQ0NzkwODYlMkMlMjJmaXJzdF9uYW1lJTIyJTNBJTIyTGUlMjIlMkMlMjJsYXN0X25hbWUlMjIlM0ElMjJRdXllbiUyMiUyQyUyMnVzZXJuYW1lJTIyJTNBJTIyaG9sZXF1eWVuODYyMTAxMSUyMiUyQyUyMmxhbmd1YWdlX2NvZGUlMjIlM0ElMjJlbiUyMiUyQyUyMmFsbG93c193cml0ZV90b19wbSUyMiUzQXRydWUlMkMlMjJwaG90b191cmwlMjIlM0ElMjJodHRwcyUzQSU1QyUyRiU1QyUyRnQubWUlNUMlMkZpJTVDJTJGdXNlcnBpYyU1QyUyRjMyMCU1QyUyRk8xdXVCOEhMRlY4QlFJZmM4VGE2bjF4eFRSdEFRWmNPSUxLc1h3X2UwWGY0eEpfZlhBZ0o0clpPRG93eDF4OE0uc3ZnJTIyJTdEJmNoYXRfaW5zdGFuY2U9LTI2MzYzMTY2OTQxMDczMDY2NTkmY2hhdF90eXBlPXNlbmRlciZhdXRoX2RhdGU9MTczNjI0MTI2OCZzaWduYXR1cmU9MXdWTDdvODc0anVWYndJaGxjal9aR01mcmgtVzVBQzdIS1p5SEY1ejFfT0dBYWRRaGJUNEl2cnJISHBuc0ZoVVRmUXBZR3R2RndyWU9ZTm1fWnN0QXcmaGFzaD03NzJlMzUwZjc3NGI3NTJiZTEzNmQwNDk5Zjc3NWMyNGUwN2VjODZiMTNlYWFiOWMzNmIzNDM0ODI0YTViNDQw"
//   ); // Add or update the query parameter

//   return url.toString(); // Return the modified URL as a string
// }

async function connectTele(query, headers, proxy) {
  const payload = {
    tg_data: query,
  };

  const url =
    "https://api.meshchain.ai/meshmain/auth/link/telegram?provider=telegram&code=dXNlcj0lN0IlMjJpZCUyMiUzQTU0OTQ0NzkwODYlMkMlMjJmaXJzdF9uYW1lJTIyJTNBJTIyTGUlMjIlMkMlMjJsYXN0X25hbWUlMjIlM0ElMjJRdXllbiUyMiUyQyUyMnVzZXJuYW1lJTIyJTNBJTIyaG9sZXF1eWVuODYyMTAxMSUyMiUyQyUyMmxhbmd1YWdlX2NvZGUlMjIlM0ElMjJlbiUyMiUyQyUyMmFsbG93c193cml0ZV90b19wbSUyMiUzQXRydWUlMkMlMjJwaG90b191cmwlMjIlM0ElMjJodHRwcyUzQSU1QyUyRiU1QyUyRnQubWUlNUMlMkZpJTVDJTJGdXNlcnBpYyU1QyUyRjMyMCU1QyUyRk8xdXVCOEhMRlY4QlFJZmM4VGE2bjF4eFRSdEFRWmNPSUxLc1h3X2UwWGY0eEpfZlhBZ0o0clpPRG93eDF4OE0uc3ZnJTIyJTdEJmNoYXRfaW5zdGFuY2U9LTI2MzYzMTY2OTQxMDczMDY2NTkmY2hhdF90eXBlPXNlbmRlciZhdXRoX2RhdGU9MTczNjI0MTI2OCZzaWduYXR1cmU9MXdWTDdvODc0anVWYndJaGxjal9aR01mcmgtVzVBQzdIS1p5SEY1ejFfT0dBYWRRaGJUNEl2cnJISHBuc0ZoVVRmUXBZR3R2RndyWU9ZTm1fWnN0QXcmaGFzaD03NzJlMzUwZjc3NGI3NTJiZTEzNmQwNDk5Zjc3NWMyNGUwN2VjODZiMTNlYWFiOWMzNmIzNDM0ODI0YTViNDQw";
  const result = await coday(
    url,
    "POST",
    {
      ...headers,
      //   path: "/meshmain/auth/link/telegram",
    },
    payload,
    proxy
  );
  return result || null;
}

async function newTokenTele(query, headers, proxy) {
  const payload = {
    referral_code: "T_2024951199",
  };
  const url = "https://api.meshchain.ai/meshmain/auth/telegram-miniapp-signin";
  const result = await coday(
    url,
    "POST",
    {
      ...headers,
      Authorization: `tma ${query}`,
    },
    payload,
    proxy
  );
  return result || null;
}

export { coday, estimate, claim, start, info, infoSpin, doSpin, init, withdraw, getTokensInfo, rewardInfo, userInfo, spinInfo, connectTele, newTokenTele };
