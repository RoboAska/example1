// ===========================================
// WAREHOUSE INVENTORY SYSTEM
// script.js - PART 1
// ===========================================

// ---------- ELEMENTS ----------
const excelFile = document.getElementById("excelFile");
const tableBody = document.querySelector("#inventoryTable tbody");

const totalRecords = document.getElementById("totalRecords");
const totalWarehouse = document.getElementById("totalWarehouse");
const totalCompany = document.getElementById("totalCompany");
const totalAvailableQty = document.getElementById("totalAvailableQty");

// ---------- GLOBAL DATA ----------
let inventoryData = [];

// ===========================================
// IMPORT EXCEL
// ===========================================

excelFile.addEventListener("change", loadExcel);

function loadExcel(event){

    const file = event.target.files[0];

    if(!file){

        alert("Please select an Excel file.");

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data,{
            type:"array"
        });

        const firstSheet = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[firstSheet];

        inventoryData = XLSX.utils.sheet_to_json(
            worksheet,
            {
                defval:"",
                raw:false
            }
        );

        console.log(inventoryData);

        renderTable(inventoryData);

        updateDashboard();

    }

    reader.readAsArrayBuffer(file);

}

// ===========================================
// TABLE
// ===========================================

function renderTable(data){

    tableBody.innerHTML="";

    if(data.length===0){

        tableBody.innerHTML=`
        <tr>
            <td colspan="14" class="text-center">
                No Data Found
            </td>
        </tr>
        `;

        return;

    }

    data.forEach(row=>{

        const tr=document.createElement("tr");

        tr.innerHTML=`

        <td>${row["Warehouse_Code"] ?? ""}</td>

        <td>${row["Warehouse_Name "] || row["Warehouse_Name"] || ""}</td>

        <td>${row["Company_Code"] ?? ""}</td>

        <td>${row["Company_Name"] ?? ""}</td>

        <td>${row["SKU_Code"] ?? ""}</td>

        <td>${row["SKU_Name"] ?? ""}</td>

        <td>${row["WBS"] ?? ""}</td>

        <td>${row["单位"] ?? ""}</td>

        <td>${row["Available Qty"] ?? 0}</td>

        <td>${row["Onhand Qty"] ?? 0}</td>

        <td>${row["Intransit Qty"] ?? 0}</td>

        <td>${row["Allocated Qty"] ?? 0}</td>

        <td>${row["Locked Qty"] ?? 0}</td>

        <td>${row["inventorySts"] ?? ""}</td>

        `;

        tableBody.appendChild(tr);

    });

}

// ===========================================
// DASHBOARD
// ===========================================

function updateDashboard(){

    totalRecords.textContent = inventoryData.length;

    const warehouseSet = new Set();
    const companySet = new Set();

    let availableQty = 0;

    inventoryData.forEach(item => {

        warehouseSet.add(item["Warehouse_Code"]);

        companySet.add(item["Company_Name"]);

        availableQty += Number(item["Available Qty"] || 0);

    });

    totalWarehouse.textContent = warehouseSet.size;

    totalCompany.textContent = companySet.size;

    totalAvailableQty.textContent =
        availableQty.toLocaleString();

}