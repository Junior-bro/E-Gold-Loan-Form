
// Optimized Logic
  function loadPhoto(event) {
    const preview = document.getElementById('photoPreview');
    const text = document.getElementById('photoText');
    const file = event.target.files[0];

    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
      text.style.display = 'none'; // hide placeholder text
    } else {
      preview.src = '';
      preview.style.display = 'none';
      text.style.display = 'block'; // show placeholder text again
    }
  }


function changeColorAndPrint() {
    const btn = document.getElementById("printButton");
    if(btn) btn.style.backgroundColor = "green";
    window.print();
}


document.addEventListener('input', function (e) {
    // Look for the auto-grow-field class
    if (e.target.classList.contains('auto-grow-field')) {
        const inputField = e.target;
        const newValue = inputField.innerText; // Use innerText instead of value
        
        // Find all other fields with the same purpose and sync them
        // (If you have this field on Page 1 and Page 2)
        const allTargets = document.querySelectorAll('.auto-grow-field');
        allTargets.forEach(target => {
            if (target !== inputField) {
                target.innerText = newValue;
            }
        });
    }
});

// 2. Print Button Logic
// Changes button color to green as feedback and opens print dialog
function changeColorAndPrint() {
    const btn = document.getElementById("printButton");
    if(btn) {
        btn.style.backgroundColor = "green";
        btn.innerText = "Preparing Print...";
    }
    
    // Slight delay to ensure color change is visible before print dialog freezes the UI
    setTimeout(() => {
        window.print();
        // Reset button text after printing starts
        if(btn) btn.innerText = "Print Document";
    }, 500);
}

// 3. Sync and Auto-Sum Logic
// Monitors all inputs in the document
document.addEventListener('input', function (e) {
    if (e.target.closest('.sync-table') && e.target.classList.contains('user-input')) {
        const input = e.target;
        const cell = input.closest('td');
        const row = input.closest('tr');
        const table = input.closest('table');
        
        // Coordinates
        const colIndex = Array.from(row.children).indexOf(cell);
        const rowIndex = Array.from(table.querySelectorAll('tbody tr')).indexOf(row);
        
        const allTables = document.querySelectorAll('.sync-table');

        // SYNC across tables
        allTables.forEach(t => {
            const targetRows = t.querySelectorAll('tbody tr');
            if (targetRows[rowIndex]) {
                const targetInput = targetRows[rowIndex].children[colIndex].querySelector('input');
                if (targetInput && targetInput !== input) {
                    targetInput.value = input.value;
                }
            }
        });

        // AUTO-SUM
        calculateTotals(allTables);
    }
});

function calculateTotals(tables) {
    tables.forEach(table => {
        // Get all rows except the one marked as total-row
        const dataRows = Array.from(table.querySelectorAll('tbody tr:not(.total-row)'));
        const totalRow = table.querySelector('.total-row');
        
        if (!totalRow) return;
        
        const totalInputs = totalRow.querySelectorAll('.total-field');

        // Column indices to sum (based on your HTML structure):
        // Index 2: Gross Weight | Index 3: Net Weight | Index 4: Valuation
        const columnsToSum = [2, 3, 4];

        columnsToSum.forEach((colIdx, i) => {
            let sum = 0;
            dataRows.forEach(row => {
                const inputElement = row.children[colIdx].querySelector('input');
                if (inputElement) {
                    // Remove commas before parsing if the value was synced from a total
                    const val = parseFloat(inputElement.value.replace(/,/g, '')) || 0;
                    sum += val;
                }
            });
            
            // i maps to the 3 inputs in our totalInputs list
            if (colIdx === 4) {
                // Formatting for Rupees with Indian Locale
                totalInputs[i].value = sum > 0 ? sum.toLocaleString('en-IN') : ""; 
            } else {
                // Formatting for Weight (2 decimal places)
                totalInputs[i].value = sum > 0 ? sum.toFixed(2) : "";
            }
        });
    });
}


// A. RESTRICT TO NUMBERS ONLY
document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('auto-grow-number')) {
        // Allow: backspace, delete, tab, escape, enter, and .
        const allowedKeys = [8, 9, 27, 13, 110, 190, 46];
        if (allowedKeys.indexOf(e.keyCode) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 return;
        }
        // Ensure that it is a number and stop the keypress if not
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }
});

// B. SYNC & CALCULATION
document.addEventListener('input', function (e) {
    if (e.target.classList.contains('auto-grow-number')) {
        const inputField = e.target;
        const cell = inputField.closest('td');
        const row = inputField.closest('tr');
        const table = inputField.closest('table');
        
        // Find position for syncing
        const colIndex = Array.from(row.children).indexOf(cell);
        const rowIndex = Array.from(table.querySelectorAll('tbody tr')).indexOf(row);
        
        const allTables = document.querySelectorAll('.sync-table');

        // Parallel sync
        allTables.forEach(t => {
            const targetRows = t.querySelectorAll('tbody tr');
            if (targetRows[rowIndex]) {
                const target = targetRows[rowIndex].children[colIndex].querySelector('.auto-grow-number');
                if (target && target !== inputField) {
                    target.innerText = inputField.innerText;
                }
            }
        });

        // Trigger your calculateTotals function
        calculateTotals(allTables);
    }
});

function syncAll(element) {
  // Get the text currently typed by the user
  const text = element.innerText;
  
  // Find every element on the page that has the 'sync-input' class
  const allFields = document.querySelectorAll('.sync-input');
  
  allFields.forEach(field => {
    // Update every field EXCEPT the one the user is currently typing in
    // This prevents the cursor from jumping to the start/end
    if (field !== element) {
      field.innerText = text;
    }
  });
}

function syncAndGrow(element) {
  // 1. Get value and remove non-numeric characters (except decimal)
  let val = element.textContent.replace(/[^0-9.]/g, '');
  
  // 2. Prevent multiple decimals
  const parts = val.split('.');
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');

  // 3. Enforce the 99.99 limit
  if (parseFloat(val) > 99.99) {
    val = "99.99";
  }

  // 4. Update the typed element and all synced elements
  const allRateFields = document.querySelectorAll('.sync-rate');
  allRateFields.forEach(field => {
    field.textContent = val;
  });

  // 5. Maintain cursor position for the active element
  if (val.length > 0) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

// 1. Syncs all fields instantly while typing
function syncLoan(element) {
  let val = element.textContent.replace(/[^0-9.]/g, '');
  
  // Prevent multiple dots
  const parts = val.split('.');
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');

  const allLoanFields = document.querySelectorAll('.sync-loan');
  allLoanFields.forEach(field => {
    if (field !== element) {
      field.textContent = val;
    }
  });
}

// 2. Forces "at least 2 decimals" when user clicks away
function formatToTwoDecimals(element) {
  let val = parseFloat(element.textContent);
  
  if (!isNaN(val)) {
    // Fixed to 2 decimal places
    const formatted = val.toFixed(2);
    
    // Update all synced fields with the formatted version
    const allLoanFields = document.querySelectorAll('.sync-loan');
    allLoanFields.forEach(field => {
      field.textContent = formatted;
    });
  }
}

function universalSync(element) {
  // Get the text from the current field
  const value = element.innerText;
  
  // Find which group this field belongs to
  const groupName = element.getAttribute('data-group');
  
  // Find all other fields in the SAME group
  const groupMembers = document.querySelectorAll(`[data-group="${groupName}"]`);
  
  groupMembers.forEach(field => {
    // Update all members except the one being typed in
    if (field !== element) {
      field.innerText = value;
    }
  });
}

// Function to force 2 decimals on blur for numeric groups
function formatDecimals(element) {
  let val = parseFloat(element.innerText);
  
  if (!isNaN(val)) {
    const formatted = val.toFixed(2);
    const groupName = element.getAttribute('data-group');
    const groupMembers = document.querySelectorAll(`[data-group="${groupName}"]`);
    
    groupMembers.forEach(field => {
      field.innerText = formatted;
    });
  }
}

/**
 * Synchronizes all elements sharing the same class name
 * @param {string} className - The specific class to update
 * @param {HTMLElement} element - The current element being typed in
 */
function syncByClass(className, element) {
    const text = element.innerText;
    const targets = document.querySelectorAll('.' + className);

    targets.forEach(target => {
        if (target !== element) {
            target.innerText = text;
        }
    });
}

function syncWords(element) {
    // Get the text from the current field
    const currentText = element.innerText;
    
    // Find all fields with this specific class
    const allWordFields = document.querySelectorAll('.sync-words-field');
    
    allWordFields.forEach(field => {
        // Update all other fields to match
        if (field !== element) {
            field.innerText = currentText;
        }
    });
}
function syncPrince(element) {
  // Get what the user is currently typing
  const textValue = element.innerText;
  
  // Find every element with the class 'prince'
  const allPrinceFields = document.querySelectorAll('.prince');
  
  allPrinceFields.forEach(field => {
    // Update the text in all 'prince' fields except the one being typed in
    if (field !== element) {
      field.innerText = textValue;
    }
  });
}
function syncKing(element) {
    // 1. Capture the text being typed
    const textValue = element.innerText;
    
    // 2. Find every element with the class 'king'
    const allKingFields = document.querySelectorAll('.king');
    
    // 3. Loop through them and update their content
    allKingFields.forEach(field => {
        if (field !== element) {
            field.innerText = textValue;
        }
    });
}
// 1. Function to sync manual edits
function syncDate(element) {
    const text = element.innerText;
    const allDateFields = document.querySelectorAll('.king-date');
    allDateFields.forEach(field => {
        if (field !== element) field.innerText = text;
    });
}

// 2. Function to set the system date automatically when the page opens
window.addEventListener('DOMContentLoaded', (event) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const yyyy = today.getFullYear();

    const dateString = `${dd}/${mm}/${yyyy}`;
    
    // Fill all date fields on the page
    const allDateFields = document.querySelectorAll('.king-date');
    allDateFields.forEach(field => {
        field.innerText = dateString;
    });
});
function syncQueen(element) {
    // Capture what the user is typing
    const text = element.innerText;
    
    // Find every element with the class 'queen'
    const allQueenFields = document.querySelectorAll('.queen');
    
    // Update all 'queen' fields to match
    allQueenFields.forEach(field => {
        if (field !== element) {
            field.innerText = text;
        }
    });
}

  const input = document.querySelector('.user-input');

  input.addEventListener('input', function() {
    // Reset width to shrink if needed
    this.style.width = "1px";
    // Set width based on scrollWidth (actual content width)
    this.style.width = (this.scrollWidth + 10) + "px";
  });

 function logout() {
        // Redirect back to login page
        window.location.href = "Login_page.html";
 }

  document.getElementById("printBtn").addEventListener("click", function() {
    window.print();
  });
