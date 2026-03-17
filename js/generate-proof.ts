import { Barretenberg, UltraHonkBackend } from "@aztec/bb.js";
import fs from "fs";
import circuit from "../circuits/target/noir_solidity.json";
// @ts-ignore
import { Noir } from "@noir-lang/noir_js";
import { BackendType, VerifierTarget } from "@aztec/bb.js";


(async () => {
  try {
    const noir = new Noir(circuit as any);

    const bb = await Barretenberg.new({ threads: 8, backend: BackendType.Wasm });
    const honk = new UltraHonkBackend(circuit.bytecode, bb);

    const inputs = { x: 3, y: 3 }
    const { witness } = await noir.execute(inputs);
    const { proof, publicInputs } = await honk.generateProof(witness, { verifierTarget: 'evm' });

    await honk.verifyProof({ proof, publicInputs }, { verifierTarget: 'evm' });

    // save proof to file
    fs.writeFileSync("../circuits/target/proof", proof);

    // not really needed as we harcode the public input in the contract test
    fs.writeFileSync("../circuits/target/public-inputs", JSON.stringify(publicInputs));

    console.log("Proof generated successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
