import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

function CurretForm() {
  const [data, setData] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("Egyptian Pound(EGP)");
  const [toCurrency, setToCurrency] = useState("Egyptian Pound(EGP)");
  const [amount, setAmount] = useState("");
  const [convertedValue, setConvertedValue] = useState("");
  const [foundRate, setFoundRate] = useState([]);
  const [showConvertedValue, setShowConvertedValue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState("");

  useEffect(() => {
    const dataRef = ref(db, "excelData");

    onValue(
      dataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          setData(Object.values(rawData));
        }
        setLoading(false);
      },
      { onlyOnce: true }
    );
  }, []);

  const handleShow = (e) => {
    e.preventDefault();
    setShowConvertedValue(false);
    setError("");

    if (!fromCurrency || !toCurrency || !amount) {
      setError("All fields are required.");
      return;
    }

    const filteredData = data.filter(
      (item) => item.From === fromCurrency && item.To === toCurrency
    );

    if (filteredData.length === 0) {
      setConvertedValue("No data found");
      return;
    }

    filteredData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`); // تحويل التنسيق إلى YYYY-MM-DD
    };

    let selectedRate = filteredData.find((item) => {
      const itemDate = parseDate(item.Date);
      return (
        itemDate.toDateString() === selectedDate.toDateString() ||
        itemDate.getTime() <= selectedDate.getTime()
      );
    });
    setFoundRate(selectedRate);

    if (!selectedRate) {
      setConvertedValue("No data found");
      return;
    }

    if (amount) {
      setConvertedValue(
        (parseFloat(amount) * parseFloat(selectedRate.Value)).toFixed(2)
      );
      setShowConvertedValue(true);
    }
  };

  return (
    <>
    {loading?(<div className="text-center text-lg font-semibold mt-5">
          Loading data...
        </div>):(<form className="max-w-sm md:max-w-lg mx-auto my-10">
      <div className="mb-5">
        <label className="block mb-2 text-lg font-medium text-gray-900">
          Select Date
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-lg font-medium text-gray-900">
          Amount to convert
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-lg font-medium text-gray-900">
          From currency
        </label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
        >
          <option value="Egyptian Pound(EGP)">Egyptian Pound(EGP)</option>
          <option value="Kuwaiti Dinar(KWD)">Kuwaiti Dinar(KWD)</option>
          <option value="United States Dollar(USD)">
            United States Dollar(USD)
          </option>
          <option value="Saudi Riyal(SAR)">Saudi Riyal(SAR)</option>
          <option value="United Arab Emirates Dirham(AED)">
            United Arab Emirates Dirham(AED)
          </option>
          <option value="Euro(EUR)">Euro(EUR)</option>
          <option value="Libyan Dinar(LYD)">Libyan Dinar(LYD)</option>
          <option value="Omani Rial(OMR)">Omani Rial(OMR)</option>
          <option value="Qatari Riyal(QAR)">Qatari Riyal(QAR)</option>
          <option value="Jordanian Dinar(JOD)">Jordanian Dinar(JOD)</option>
          <option value="Indian Rupees(INR)">Indian Rupees(INR)</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-lg font-medium text-gray-900">
          To currency
        </label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
        >
          <option value="Egyptian Pound(EGP)">Egyptian Pound(EGP)</option>
          <option value="Kuwaiti Dinar(KWD)">Kuwaiti Dinar(KWD)</option>
          <option value="United States Dollar(USD)">
            United States Dollar(USD)
          </option>
          <option value="Saudi Riyal(SAR)">Saudi Riyal(SAR)</option>
          <option value="United Arab Emirates Dirham(AED)">
            United Arab Emirates Dirham(AED)
          </option>
          <option value="Euro(EUR)">Euro(EUR)</option>
          <option value="Libyan Dinar(LYD)">Libyan Dinar(LYD)</option>
          <option value="Omani Rial(OMR)">Omani Rial(OMR)</option>
          <option value="Qatari Riyal(QAR)">Qatari Riyal(QAR)</option>
          <option value="Jordanian Dinar(JOD)">Jordanian Dinar(JOD)</option>
          <option value="Indian Rupees(INR)">Indian Rupees(INR)</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-lg my-5">{error}</p>}

      <div>
        <button
          onClick={handleShow}
          className="text-white bg-gray-900 hover:bg-gray-600 font-medium rounded-full text-sm px-5 py-2.5"
        >
          Show
        </button>
      </div>

      {showConvertedValue && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="p-2">Rate Date</th>
                <th className=" p-2">From</th>
                <th className=" p-2">To</th>
                <th className="p-2">Rate</th>
                <th className=" p-2">Converted Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white text-black border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className=" p-2">{foundRate.Date}</td>
                <td className=" p-2">{foundRate.From}</td>
                <td className=" p-2">{foundRate.To}</td>
                <td className=" p-2">
                  {foundRate.Value}
                </td>
                <td className=" p-2">{convertedValue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </form>)}
    </>
  );
}

export default CurretForm;
