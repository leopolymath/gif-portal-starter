export const idl = {
  version: "0.0.0",
  name: "twitterportal",
  instructions: [
    {
      name: "startStuffOff",
      accounts: [
        {
          name: "baseAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "addGif",
      accounts: [
        {
          name: "baseAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "gifLink",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "BaseAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "totalGifs",
            type: "u64",
          },
          {
            name: "gifList",
            type: {
              vec: {
                defined: "ItemStruct",
              },
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "ItemStruct",
      type: {
        kind: "struct",
        fields: [
          {
            name: "gifLink",
            type: "string",
          },
          {
            name: "userAddress",
            type: "publicKey",
          },
        ],
      },
    },
  ],
  metadata: {
    address: "CHiAY4vVe5TboHwBiAYz6CFzWzAtV1eumNHjD9Ac91GF",
  },
};
