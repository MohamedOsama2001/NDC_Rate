import React, { useState } from "react";
import * as XLSX from "xlsx";
import { ref, set, remove } from "firebase/database";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadForm() {
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);

  // تحويل Excel Serial Number إلى تنسيق DD/MM/YYYY
  const excelSerialToDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const date = new Date(utc_days * 86400000);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const [keys, ...rows] = jsonData;

      const requiredFields = ["Date", "From", "To", "Value"];
      const fieldIndexes = keys
        .map((key, i) => (requiredFields.includes(key) ? i : -1))
        .filter((i) => i !== -1);

      const formattedData = rows
        .map((row) => {
          let rowData = fieldIndexes.map((i, index) => {
            let value = row[i] || "";

            if (requiredFields[index] === "Date") {
              if (typeof value === "number") {
                value = excelSerialToDate(value);
              } else if (typeof value === "string") {
                // التأكد من إزالة الوقت إذا كان موجودًا
                let cleanDate = value.split(" ")[0]; // يأخذ فقط التاريخ بدون الوقت

                // تحويل أي تاريخ موجود بالنمط "YYYY-MM-DD" إلى "DD/MM/YYYY"
                const dateParts = cleanDate.split("-");
                if (dateParts.length === 3) {
                  value = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                } else {
                  value = cleanDate; // إذا كان بالفعل بصيغة صحيحة
                }
              }
            }

            return value;
          });

          if (rowData.every((val) => val !== "")) {
            return Object.fromEntries(
              requiredFields.map((key, i) => [key, rowData[i]])
            );
          }
          return null;
        })
        .filter((row) => row !== null);

      // ترتيب البيانات بحيث الأحدث يظهر أولًا
      formattedData.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.Date.split("/").map(Number);
        return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
      });

      setExcelData(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUploadClick = () => {
    if (excelData.length === 0) {
      toast.error("No data to upload!");
      return;
    }

    setLoading(true);

    const dataRef = ref(db, "excelData");

    remove(dataRef)
      .then(() => set(dataRef, excelData))
      .then(() => {
        setLoading(false);
        toast.success("Uploaded Successfully!");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Upload Failed: " + error.message);
      });
  };

  return (
    <form className="max-w-sm md:max-w-lg mx-auto mt-24">
      <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white" htmlFor="excel_upload">
        Upload Rate File
      </label>
      <input
        className="block my-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="excel_upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
      <div>
        <button
          type="button"
          onClick={handleUploadClick}
          className="text-white bg-gray-900 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={loading}
        >
          {loading ? "Uploading Now..." : "Upload"}
        </button>
      </div>
      <ToastContainer />
    </form>
  );
}

export default UploadForm;
