#!/bin/bash

set -e

# Usage: ./build_ios.sh [dev|prod]

TARGET="$1" # dev or prod

if [[ "$TARGET" != "dev" && "$TARGET" != "prod" ]]; then
  echo "TARGET must be \"dev\" or \"prod\""
  exit 1
fi

ENV_FILE=".env.ios.${TARGET}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Env file $ENV_FILE does not exist!"
  exit 1
fi

echo "📄 Copying $ENV_FILE to .env ..."
cp "$ENV_FILE" .env

echo "📦 Prebuilding iOS app..."
npx expo prebuild --platform ios

if [[ "$TARGET" == "dev" ]]; then
  SCHEME="LivoFacilities Dev"
  EXPORT_METHOD="development"
else
  SCHEME="LivoFacilities"
  EXPORT_METHOD="app-store"
fi

WORKSPACE="ios/LivoFacilities.xcworkspace"
ARCHIVE_PATH="ios/build/${SCHEME// /_}.xcarchive"
EXPORT_PATH="ios/build/${SCHEME// /_}"
EXPORT_OPTIONS_PATH="ios/build/exportOptions_${TARGET}.plist"

# 📝 Tạo exportOptions.plist tạm thời
echo "🛠️ Creating exportOptions.plist for $TARGET ..."
mkdir -p ios/build
cat > "$EXPORT_OPTIONS_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
  <key>method</key>
  <string>$EXPORT_METHOD</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>uploadBitcode</key>
  <false/>
  <key>uploadSymbols</key>
  <true/>
</dict>
</plist>
EOF

# 🧼 Clean
echo "🧼 Cleaning previous build..."
rm -rf "$ARCHIVE_PATH" "$EXPORT_PATH"

# 🔨 Archive
echo "🔨 Archiving $SCHEME ..."
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -sdk iphoneos \
  -archivePath "$ARCHIVE_PATH" \
  clean archive

# 📦 Export
echo "📦 Exporting .ipa ..."
xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS_PATH" \
  -exportPath "$EXPORT_PATH"

IPA_PATH=$(find "$EXPORT_PATH" -name "*.ipa" | head -n 1)

if [[ -f "$IPA_PATH" ]]; then
  echo "✅ Done. IPA file generated at:"
  echo "$IPA_PATH"
else
  echo "❌ Failed to export .ipa"
  exit 1
fi
