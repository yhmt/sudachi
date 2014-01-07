var CONF = {
        FOLDER_NAME : "IRC Theme",
        ACCESS      : DriveApp.Access.ANYONE,
        PERMISSION  : DriveApp.Permission.VIEW,
        ROW_HEIGHT  : 32
    },
    CELL = {
        ID            : 1,
        SCREEN_NAME   : 2,
        ICON_URL      : 3,
        ICON_PREVIEW  : 4,
        ORIGINAL_ICON : 5
    },
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet(),
    sheet       = SpreadsheetApp.getActiveSheet(),
    // spreadsheet = SpreadsheetApp.openById("0AkiE9r2RNrWhdC11UUFhT2V4WVVwbXVjNHY2WmN2LVE"),
    // sheet       = spreadsheet.getSheetByName("シート1"),
    iconIdRegex = /https?:\/\/docs\.google\.com\/file\/d\/(\w+)\/edit/,
    iconBaseUrl = "http://drive.google.com/uc?export=download&id=";

function onOpen() {
    var subMenus = [];
    
    subMenus.push({name: "fetchAllIcon", functionName: "fetchAllIcon"});
    subMenus.push({name: "setRowHeight", functionName: "setRowHeightAll"});

    spreadsheet.addMenu("Custom Menu", subMenus);
}

function doGet(req) {
    var res = {
        data : createJSON()
    };

    return ContentService
            // .createTextOutput(JSON.stringify(res))
            // .createTextOutput("callback(" + JSON.stringify(res) + ")")
            .createTextOutput(req.parameters.callback + "(" + JSON.stringify(res) + ")")
            .setMimeType(ContentService.MimeType.JSON);
}

function getIconUrl(row) {
    if (!row) {
        return;
    }

    var folder   = DriveApp.getFoldersByName(CONF.FOLDER_NAME).next(),
        userId   = sheet.getRange(row, CELL.ID).getValue()
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
        len    = values.length;
        ret    = [],
        obj    = null;

    for (; i < len; ++i) {
        obj = {
            "id"          : values[i][0],
            "screen_name" : values[i][1],
            "icon_url"    : values[i][2]
        };

        ret.push(obj);
    } 

    return ret;
}
