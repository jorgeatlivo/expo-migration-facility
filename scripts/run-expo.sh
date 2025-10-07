#!/bin/bash

set -e

# Usage: ./run_expo.sh android dev
#        ./run_expo.sh ios prod


# Parse positional args
PLATFORM="$1"
VARIANT="$2"
shift 2

# Collect all extra params (e.g. --device, --port, etc.)
EXTRA_ARGS=("$@")

# Validate args
if [[ "$PLATFORM" != "android" && "$PLATFORM" != "ios" ]]; then
  echo "PLATFORM must be \"android\" or \"ios\""
  exit 1
fi

if [[ "$VARIANT" != "dev" && "$VARIANT" != "prod" ]]; then
  echo "VARIANT must be \"dev\" or \"prod\""
  exit 1
fi

# Set source env file name
ENV_FILE=".env.${PLATFORM}.${VARIANT}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file $ENV_FILE does not exist!"
  exit 1
fi

echo "Copying $ENV_FILE to .env ..."
cp "$ENV_FILE" .env

echo "Running prebuild for platform $PLATFORM ..."
npx expo prebuild --platform "$PLATFORM"

# Run appropriate expo command
if [[ "$PLATFORM" == "android" ]]; then
  if [[ "$VARIANT" == "dev" ]]; then
    expo run:android --variant=devDebug --app-id com.getlivo.professionalapp.internal.dev "${EXTRA_ARGS[@]}"
  else
    expo run:android --variant=prodDebug "${EXTRA_ARGS[@]}"
  fi
elif [[ "$PLATFORM" == "ios" ]]; then
  if [[ "$VARIANT" == "dev" ]]; then
    expo run:ios --scheme="Livo Dev" --configuration="Debug" "${EXTRA_ARGS[@]}"
  else
    expo run:ios --scheme="Livo" --configuration="Release" "${EXTRA_ARGS[@]}"
  fi
fi
