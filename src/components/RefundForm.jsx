import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { toast, ToastContainer } from "react-toastify";

function CurretForm() {
  const [data, setData] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("Egyptian Pound");
  const [toCurrency, setToCurrency] = useState("Egyptian Pound");
  const [amount, setAmount] = useState("");
  const [convertedValue, setConvertedValue] = useState("");
  const [foundRate, setFoundRate] = useState([]);
  const [showConvertedValue, setShowConvertedValue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    setFoundRate(null);

    if (!fromCurrency || !toCurrency || !amount) {
      toast.error("You must enter amount!");
      return;
    }

    const selectedTime = selectedDate.getTime();

    const matchedRates = data
      .filter((item) => item.From === fromCurrency && item.To === toCurrency)
      .map((item) => {
        const [day, month, year] = item.Date.split("/");
        const parsedDate = new Date(`${year}-${month}-${day}`);
        return { ...item, parsedDate };
      });

    const latestRate = matchedRates.reduce((latest, item) => {
      const itemTime = item.parsedDate.getTime();
      if (itemTime <= selectedTime) {
        if (!latest || itemTime > latest.parsedDate.getTime()) {
          return item;
        }
      }
      return latest;
    }, null);

    if (!latestRate) {
      setConvertedValue("No data found");
      return;
    }

    setFoundRate(latestRate);
    const result = (
      parseFloat(amount) * parseFloat(latestRate.Value)
    ).toFixed(3);
    setConvertedValue(Number(result));
    setShowConvertedValue(true);
  };


  return (
    <>
      {loading ? (<div className="text-center text-lg font-semibold mt-5">
        Loading data...
      </div>) : (<form className="max-w-sm md:max-w-lg mx-auto my-12">
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
            <option value="Egyptian Pound">Egyptian Pound(EGP)</option>
            <option value="Kuwaiti Dinar">Kuwaiti Dinar(KWD)</option>
            <option value="United States Dollar">
              United States Dollar(USD)
            </option>
            <option value="Saudi Riyal">Saudi Riyal(SAR)</option>
            <option value="United Arab Emirates Dirham">
              United Arab Emirates Dirham(AED)
            </option>
            <option value="Euro">Euro(EUR)</option>
            <option value="Libyan Dinar">Libyan Dinar(LYD)</option>
            <option value="Omani Rial">Omani Rial(OMR)</option>
            <option value="Qatari Riyal">Qatari Riyal(QAR)</option>
            <option value="Jordanian Dinar">Jordanian Dinar(JOD)</option>
            <option value="Indian Rupees">Indian Rupees(INR)</option>
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
            <option value="Egyptian Pound">Egyptian Pound(EGP)</option>
            <option value="Kuwaiti Dinar">Kuwaiti Dinar(KWD)</option>
            <option value="United States Dollar">
              United States Dollar(USD)
            </option>
            <option value="Saudi Riyal">Saudi Riyal(SAR)</option>
            <option value="United Arab Emirates Dirham">
              United Arab Emirates Dirham(AED)
            </option>
            <option value="Euro">Euro(EUR)</option>
            <option value="Libyan Dinar">Libyan Dinar(LYD)</option>
            <option value="Omani Rial">Omani Rial(OMR)</option>
            <option value="Qatari Riyal">Qatari Riyal(QAR)</option>
            <option value="Jordanian Dinar">Jordanian Dinar(JOD)</option>
            <option value="Indian Rupees">Indian Rupees(INR)</option>
          </select>
        </div>
        <div>
          <button
            onClick={handleShow}
            className="text-white bg-gray-900 hover:bg-gray-600 font-medium rounded-full text-sm px-5 py-2.5"
          >
            Show
          </button>
        </div>
        <>
          {foundRate ? (<>
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
          </>) : (<div className="text-lg my-5">No Data Found!</div>)}
        </>
        <ToastContainer />
      </form>)}
    </>
  );
}

export default CurretForm;
