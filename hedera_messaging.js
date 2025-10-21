require("dotenv").config();
const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
} = require("@hashgraph/sdk");
const crypto = require("crypto");

// ---------------------- CONFIG ----------------------
const accountId = process.env.MY_ACCOUNT_ID;
const privateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

// ---------------------- CLIENT ----------------------
const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

// ---------------------- ENCRYPTION HELPERS ----------------------
// AES-256-CBC encryption with unique IV per message
function encryptMessage(message) {
  const key = crypto.randomBytes(32); // AES-256 key
  const iv = crypto.randomBytes(16);  // unique IV
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encrypted, key: key.toString("hex"), iv: iv.toString("hex") };
}

function decryptMessage(encrypted, keyHex, ivHex) {
  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ---------------------- DATE FORMATTING ----------------------
function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// ---------------------- MAIN ----------------------
async function main() {
  // 1️ Create Topic
  const topicTx = await new TopicCreateTransaction().execute(client);
  const receipt = await topicTx.getReceipt(client);
  const topicId = receipt.topicId;
  console.log("Topic Created:", topicId.toString());

  // 2️ Messages to send
  const messages = ["Hello, Hedera!", "Learning HCS", "Message 3"];
  const encryptedMessages = []; // store encrypted messages + key + iv

  console.log("\nMessages Sent:");
  for (let i = 0; i < messages.length; i++) {
    const { encrypted, key, iv } = encryptMessage(messages[i]);
    encryptedMessages.push({ encrypted, key, iv });

    const submitTx = await new TopicMessageSubmitTransaction({
      topicId,
      message: encrypted,
    }).execute(client);

    await submitTx.getReceipt(client);
    console.log(`${i + 1}. "${messages[i]}" at ${formatDate(new Date())}`);
  }

  // 3️ Receive messages (for demo, we decrypt stored encryptedMessages)
  console.log("\nMessages Received:");
  for (let i = 0; i < encryptedMessages.length; i++) {
    const { encrypted, key, iv } = encryptedMessages[i];
    const decrypted = decryptMessage(encrypted, key, iv);
    console.log(`${i + 1}. "${decrypted}" at ${formatDate(new Date())}`);
  }

  // 4️ Filter messages
  const keyword = "Hedera";
  console.log(`\nFiltered Messages containing "${keyword}":`);
  encryptedMessages
    .map(({ encrypted, key, iv }) => decryptMessage(encrypted, key, iv))
    .filter((msg) => msg.includes(keyword))
    .forEach((msg, idx) => console.log(`${idx + 1}. ${msg}`));
}

main().catch((err) => console.error(err));

