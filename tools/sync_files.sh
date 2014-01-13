#!/bin/sh

fileName="Sudachi"
user=`whoami`
appStoreLimechatPath="/Users/${user}/Library/Application Support/net.limechat.LimeChat-AppStore"
normalLimechatPath="/Users/${user}/Library/Application Support/LimeChat"

if [ -e "${appStoreLimechatPath}" ]; then
  themeFilePath="${appStoreLimechatPath}/Themes"
else
  themeFilePath="${normalLimechatPath}/Themes"
fi

cp -f "${fileName}.yaml" "${themeFilePath}/${fileName}.yaml"
cp -f "${fileName}.css"  "${themeFilePath}/${fileName}.css"
cp -f "${fileName}.js"   "${themeFilePath}/${fileName}.js"
