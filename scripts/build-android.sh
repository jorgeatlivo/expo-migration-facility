#!/bin/bash

set -e

# Usage: ./build_android.sh [aab|apk] [dev|prod]

TYPE="$1"    # aab or apk
VARIANT="$2" # dev or prod

if [[ "$TYPE" != "aab" && "$TYPE" != "apk" ]]; then
  echo "TYPE must be \"aab\" or \"apk\""
  exit 1
fi

if [[ "$VARIANT" != "dev" && "$VARIANT" != "prod" ]]; then
  echo "VARIANT must be \"dev\" or \"prod\""
  exit 1
fi

ENV_FILE=".env.android.${VARIANT}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file $ENV_FILE does not exist!"
  exit 1
fi

echo "Copying $ENV_FILE to .env ..."
cp "$ENV_FILE" .env

echo "Prebuilding Android ${TYPE} for ${VARIANT} variant..."
npx expo prebuild --platform android

cd android

./gradlew clean
if [[ ! -f "gradle.properties" ]]; then
  echo "gradle.properties file does not exist!"
  exit 1
fi


echo "Building Android ${TYPE} for ${VARIANT} variant..."


if [[ "$TYPE" == "aab" ]]; then
  if [[ "$VARIANT" == "dev" ]]; then
    ./gradlew bundleDevRelease
  else
    ./gradlew bundleProdRelease
  fi
else # apk
  if [[ "$VARIANT" == "dev" ]]; then
    ./gradlew assembleDevRelease
  else
    ./gradlew assembleProdRelease
  fi
fi

cd ..
