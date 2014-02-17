var CONF = {
        FOLDER_NAME : "IRC Theme",
        ACCESS      : DriveApp.Access.ANYONE,
        PERMISSION  : DriveApp.Permission.VIEW,
        ROW_HEIGHT  : 32
    },
    CELL = {
        NICK          : 1,
        NAME          : 2,
        ICON_URL      : 3,
        ICON_PREVIEW  : 4,
        ORIGINAL_ICON : 5
    },
    // spreadsheet = SpreadsheetApp.getActiveSpreadsheet(),
    // sheet       = SpreadsheetApp.getActiveSheet(),
    sheetId     = ScriptProperties.getProperty("sheet_id"),
    spreadsheet = SpreadsheetApp.openById(sheetId),
    sheet       = spreadsheet.getSheets()[0],
    iconIdRegex = /https?:\/\/docs\.google\.com\/file\/d\/(\w+)\/edit/,
    iconBaseUrl = "http://drive.google.com/uc?export=download&id=";

function getIconUrl(row) {
    if (!row) {
        return;
    }

    var folder   = DriveApp.getFoldersByName(CONF.FOLDER_NAME).next(),
        userId   = sheet.getRange(row, CELL.NICK).getValue(),
        origIcon = sheet.getRange(row, CELL.ORIGINAL_ICON).getValue(),
        iconBlob = UrlFetchApp.fetch(origIcon).getBlob(),
        iconFile = iconBlob ? DriveApp.createFile(iconBlob) : null,
        iconId   = null;

    if (!iconFile) {
        Browser.msgBox("アイコンファイルが見つかりません");
        return;
    }

    iconFile.setName(userId);
    iconFile.setSharing(CONF.ACCESS, CONF.PERMISSION);
    folder.addFile(iconFile);

    iconId = iconIdRegex.exec(iconFile.getUrl());

    return iconId ? iconBaseUrl + iconId[1] : null;
}

function getImageBase64(src) {
    var image = UrlFetchApp.fetch(src),
        blob, contentType, base64;

    if (!image) {
        return;
    }

    blob        = image.getBlob();
    contentType = blob.getContentType();
    base64      = Utilities.base64Encode(blob.getBytes());

    return "data:" + contentType + ";base64," + base64;
}

function setIconUrl(row, url) {
    if (!row || !url) {
        return;
    }

    sheet.getRange(row, CELL.ICON_URL).setValue(url);
}

function setIconPreview(row, url) {
    if (!row || !url) {
        return;
    }

    sheet.getRange(row, CELL.ICON_PREVIEW).setValue("=image(\"" + url + "\", 1)");
}

function setRowHeightAll() {
    var i = 2, len = sheet.getLastRow();

    for (; i <= len; ++i) {
        sheet.setRowHeight(i, CONF.ROW_HEIGHT);
    }
}

function fetchAllIcon() {
    var i = 2, len = sheet.getLastRow(),
        iconUrl;

    for (; i <= len; ++i) {
        sheet.setRowHeight(i, CONF.ROW_HEIGHT);
        iconUrl = getIconUrl(i);

        if (iconUrl) {
            setIconUrl(i, iconUrl);
            setIconPreview(i, iconUrl);
        }
    }
}

function createJSON() {
    var i      = 1,
        values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues(),
        len    = values.length,
        ret    = [],
        obj    = null;

    for (; i < len; ++i) {
        obj = {
            "nick"     : values[i][0],
            "name"     : values[i][1],
            "icon_url" : values[i][2]
        };

        ret.push(obj);
    }

    return ret;
}

function onOpen() {
    var subMenus = [];

    subMenus.push({ name : "fetchAllIcon", functionName : "fetchAllIcon"    });
    subMenus.push({ name : "setRowHeight", functionName : "setRowHeightAll" });

    spreadsheet.addMenu("Custom Menu", subMenus);
}

function doGet(req) {
    var type = req.parameters.type ? req.parameters.type[0] || req.parameters.type : null,
        source, callback, response, mimeType;

    switch (type) {
    case "base64":
        source = req.parameters.src;

        if (!source) {
            return;
        }

        response = getImageBase64(source);
        mimeType = "TEXT";

        break;
    case "json":
    case "jsonp":
        /* falls through */
    default:
        callback = req.parameters.callback ? req.parameters.callback : "callback";
        response = callback + "(" + JSON.stringify({ data : createJSON() }) + ")";
        mimeType = "JSON";

        break;
    }

    return ContentService
            .createTextOutput(response)
            .setMimeType(ContentService.MimeType[mimeType]);
}
