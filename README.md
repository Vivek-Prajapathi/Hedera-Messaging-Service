# Hedera-Messaging-Service
This project demonstrates how to send, receive, and manage messages on the Hedera Hashgraph network using the Hedera Consensus Service (HCS). It provides a hands-on example for developers to:
--Create a Hedera topic for messaging
--Submit encrypted messages to the topic
--Subscribe to and retrieve messages in real-time
--Filter messages based on keywords
The project is ideal for learning HCS concepts, building decentralized chat applications, or implementing secure messaging systems on Hedera.
# Features
✅ Create a Hedera topic for messaging
✅ Send messages to the topic
✅ Receive messages in real-time via subscription
✅ Encrypt and decrypt messages for security
✅ Filter messages based on keywords
✅ Configurable for Hedera Testnet
# Steps to Run
1️⃣ Clone the Repository
git clone https://github.com/yourusername/hedera-messaging-service.git
cd hedera-messaging-service
2️⃣ Install Dependencies
npm install
Installs @hashgraph/sdk for Hedera interactions
Installs dotenv for environment variable management
3️⃣ Setup Environment Variables
Create a .env file in the project root:
MY_ACCOUNT_ID=0.0.xxxxx
MY_PRIVATE_KEY=your_private_key_here
Ensure the private key matches your account ID. Testnet credentials can be obtained from Hedera Portal.
4️⃣ Run the Script
node hedera_messaging.js
You should see console output showing:
--Topic creation ID
--Messages sent with timestamps
--Messages received via subscription
--Filtered messages based on keywords
5️⃣ Notes
You can modify the messages or keywords to test different scenarios.
Ensure your account has enough Hbar on the testnet to pay network fees.
Subscription stops automatically after receiving all messages.
