#!/bin/bash
tree src/ -L 1 -a -I "$(grep -E '^[^#].*' .gitignore 2>/dev/null | tr '\n' '|' | sed 's/|$//')|@types"
