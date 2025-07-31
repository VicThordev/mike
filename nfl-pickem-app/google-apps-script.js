// Google Apps Script Code - Deploy this as a Web App
// This code should be added to Google Apps Script and deployed as a web app

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const action = data.action
    const userData = data.data

    // Your Google Sheet ID
    const SHEET_ID = "1PzjE4FFQQ-Xt4VwlGdoE1HygYqIaI_xvogIjsGPTZdg"
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    if (action === "saveUser") {
      // Check if headers exist, if not create them
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      if (headers.length === 0 || headers[0] === "") {
        const headerRow = [
          "Timestamp",
          "Email",
          "Display Name",
          "User ID",
          "Tier",
          "Week",
          "Picks",
          "Points",
          "Payment Status",
          "Login Time",
          "Last Updated",
        ]
        sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow])
      }

      // Add user data to sheet
      const newRow = [
        userData.timestamp,
        userData.email,
        userData.displayName,
        userData.userId || "",
        userData.tier,
        userData.week,
        userData.picks,
        userData.points,
        userData.paymentStatus,
        userData.loginTime,
        userData.lastUpdated,
      ]

      // Check if user already exists (by email)
      const emailColumn = 2 // Column B
      const emails = sheet.getRange(2, emailColumn, sheet.getLastRow() - 1, 1).getValues()
      let userRowIndex = -1

      for (let i = 0; i < emails.length; i++) {
        if (emails[i][0] === userData.email) {
          userRowIndex = i + 2 // +2 because arrays are 0-indexed and we start from row 2
          break
        }
      }

      if (userRowIndex > 0) {
        // Update existing user
        sheet.getRange(userRowIndex, 1, 1, newRow.length).setValues([newRow])
      } else {
        // Add new user
        sheet.appendRow(newRow)
      }

      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: "Data saved successfully" }),
      ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    Logger.log("Error: " + error.toString())
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ message: "NFL Pickem API is running" })).setMimeType(
    ContentService.MimeType.JSON,
  )
}

// Declare variables to fix lint errors
var SpreadsheetApp
var ContentService
var Logger
