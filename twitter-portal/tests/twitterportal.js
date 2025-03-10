const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("Starting test...");

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Twitterportal;

  const baseAccount = anchor.web3.Keypair.generate();
  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("🚀 Your transaxtion signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("GIF Count", account.totalGifs.toString());

  await program.rpc.addGif(
    "https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("GIF Count", account.totalGifs.toString());
  console.log("GIF List", account.gifList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

runMain();
