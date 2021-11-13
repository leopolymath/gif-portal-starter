import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import "./App.css";
import { idl } from "./idl";
import kp from "./keypair.json";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_TWEETS = [
  "1455685018928418816",
  "1457325530404073476",
  "1457305888872669185",
  "1457184031536209924",
];

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};

const App: React.FC = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tweetsList, setTweetsList] = useState<{ gifLink: string }[] | null>(
    null
  );
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const getProvider = () => {
    // @ts-ignore
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      // @ts-ignore
      window.solana,
      // @ts-ignore
      opts.preflightCommitment
    );
    return provider;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      // @ts-ignore
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => {
    const onInputChange = (event: any) => {
      const { value } = event.target;
      setInputValue(value);
    };

    const sendTweet = async () => {
      if (inputValue.length === 0) {
        console.log("Empty input. Try again.");
      }

      console.log("Tweet link:", inputValue);
      try {
        const provider = getProvider();
        // @ts-ignore
        const program = new Program(idl, programID, provider);

        await program.rpc.addGif(inputValue, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        });
        console.log("GIF successfully sent to program", inputValue);

        await getTweetsList();
      } catch (error) {
        console.log("Error sending GIF:", error);
      }
    };

    const createGifAccount = async () => {
      try {
        const provider = getProvider();
        // @ts-ignore
        const program = new Program(idl, programID, provider);
        console.log("ping");
        await program.rpc.startStuffOff({
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [baseAccount],
        });
        console.log(
          "Created a new BaseAccount w/ address:",
          baseAccount.publicKey.toString()
        );
        await getTweetsList();
      } catch (error) {
        console.log("Error creating BaseAccount account:", error);
      }
    };

    if (tweetsList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    }

    return (
      <div className="connected-container">
        {/* Go ahead and add this input and button to start */}
        <input
          type="text"
          placeholder="Enter your tweet id!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button className="cta-button submit-gif-button" onClick={sendTweet}>
          Submit
        </button>
        <div className="gif-grid">
          {tweetsList.map((tweet, index) => (
            <div key={`${index}-${tweet.gifLink}`}>
              <TwitterTweetEmbed tweetId={tweet.gifLink} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getTweetsList = async () => {
    try {
      const provider = getProvider();
      console.log("const provider = getProvider();");
      // @ts-ignore
      const program = new Program(idl, programID, provider);
      console.log("after new Program(idl, programID, provider);");
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setTweetsList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setTweetsList(null);
    }
  };

  useEffect(() => {
    window.addEventListener("load", async (event) => {
      await checkIfWalletIsConnected();
    });
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");

      getTweetsList();
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🐦 Solana Tweets collection</p>
          <p className="sub-text">
            From Leo: view your tweets collection in the metaverse ✨
          </p>
          {/* Render your connect to wallet button right here */}
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
