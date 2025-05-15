default: 
    @just --list --unsorted

# Show version in "package.json"
version:
    @echo "Current Application Version: $(jq -r .version package.json)"

# Compile the source and generate distribution files
build:
    @bun run build

