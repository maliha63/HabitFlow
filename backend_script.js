// COPY THIS CODE INTO YOUR GOOGLE APPS SCRIPT EDITOR
// (Extensions > Apps Script inside your Google Sheet)

/**
 * Handles the "Test" visit from a browser.
 * Fixes the "Script function not found: doGet" error.
 */
function doGet(e) {
  return ContentService.createTextOutput("✅ Success! The HabitFlow backend is running.\n\nYou can now copy this URL and paste it into the HabitFlow Settings > Admin Config.");
}

/**
 * Handles the data coming from the HabitFlow App.
 * Automatically adds columns for new habits if they don't exist.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Wait for up to 10 seconds for other requests to finish
  lock.tryLock(10000);
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);
    
    // --- DYNAMIC COLUMN HANDLING ---
    
    // 1. Get current headers from the first row
    const lastCol = sheet.getLastColumn();
    let headers = [];
    if (lastCol > 0) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }
    
    // 2. Define the Standard Fields (Order matters for the first few columns)
    const standardFields = ['Date', 'Time', 'User ID', 'Name', 'Email'];
    
    // 3. Identify Habit Fields (keys in data that aren't standard)
    //    We ignore keys that we mapped manually to standard fields
    const excludeKeys = ['date', 'userId', 'userName', 'userEmail'];
    const incomingKeys = Object.keys(data).filter(k => !excludeKeys.includes(k));
    
    // 4. Ensure all headers exist
    const allDesiredHeaders = [...standardFields, ...incomingKeys];
    
    allDesiredHeaders.forEach(header => {
      if (headers.indexOf(header) === -1) {
        // Header doesn't exist, add it to the next available column
        const newColIndex = headers.length + 1;
        sheet.getRange(1, newColIndex).setValue(header);
        // Make it bold
        sheet.getRange(1, newColIndex).setFontWeight("bold");
        headers.push(header);
      }
    });
    
    // --- ROW DATA PREPARATION ---
    
    const newRow = [];
    const timestamp = new Date();
    
    // Map data to the headers
    headers.forEach(header => {
      let value = "";
      
      // Standard Mappings
      if (header === 'Date') value = data.date; // "YYYY-MM-DD" from app
      else if (header === 'Time') value = timestamp.toLocaleTimeString();
      else if (header === 'User ID') value = data.userId;
      else if (header === 'Name') value = data.userName;
      else if (header === 'Email') value = data.userEmail;
      
      // Dynamic Mappings (Habit counts/goals)
      else if (data[header] !== undefined) {
        value = data[header];
      }
      
      newRow.push(value);
    });
    
    // Append the data
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}