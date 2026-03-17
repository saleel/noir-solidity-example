set -e

rm -rf target
rm -rf ../contract/Verifier.sol

echo "Compiling circuit..."
if ! nargo compile; then
    echo "Compilation failed. Exiting..."
    exit 1
fi

echo "Generating vkey..."
bb write_vk -t evm -b ./target/noir_solidity.json -o ./target

echo "Generating solidity verifier..."
bb write_solidity_verifier -t evm -k ./target/vk -o ../contract/Verifier.sol

echo "Done"

# nargo execute
# bb prove -t evm -b ./target/noir_solidity.json -w target/noir_solidity.gz -o ./target --verify