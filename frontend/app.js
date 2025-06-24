const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const CONTRACT_ABI = [
      {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    let signer;
    let contract;

    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();

        const address = await signer.getAddress();
        document.getElementById("walletStatus").innerText = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;

        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        await updateBalance();
      } else {
        alert("MetaMask not found!");
      }
    }

    async function updateBalance() {
      if (!contract) return;
      const balance = await contract.getBalance();
      document.getElementById("balance").innerText = ethers.utils.formatEther(balance);
    }

    async function deposit() {
      const amount = document.getElementById("depositAmount").value;
      if (!amount || isNaN(amount)) return alert("Enter valid amount");

      try {
        const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        await updateBalance();
      } catch (err) {
        console.error(err);
        alert("Deposit failed");
      }
    }

    async function withdraw() {
      const amount = document.getElementById("withdrawAmount").value;
      if (!amount || isNaN(amount)) return alert("Enter valid amount");

      try {
        const tx = await contract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        await updateBalance();
      } catch (err) {
        console.error(err);
        alert("Withdraw failed");
      }
    }

    document.getElementById("connectButton").addEventListener("click", connectWallet);
    document.getElementById("depositButton").addEventListener("click", deposit);
    document.getElementById("withdrawButton").addEventListener("click", withdraw);