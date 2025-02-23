import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "../firebase";

function CurretForm() {
  const [data, setData] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("Egyptian Pound(EGP)");
  const [toCurrency, setToCurrency] = useState("Egyptian Pound(EGP)");
  const [latestValue, setLatestValue] = useState([]);
  const [amount, setAmount] = useState("");
  const [convertedValue, setConvertedValue] = useState("");
  const [showConvertedValue, setShowConvertedValue] = useState(false); // ✅ تتحكم في ظهور النتيجة
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(db, "excelData");

    onValue(
      dataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const formattedData = Object.values(rawData);
          setData(formattedData);
        }
        setLoading(false);
      },
      { onlyOnce: true }
    );
  }, []);

  const handleShow = (e) => {
    e.preventDefault();
    setShowConvertedValue(false); // ✅ إعادة تعيين الإظهار بعد كل ضغطة

    if (fromCurrency && toCurrency) {
      const filteredData = data.filter(
        (item) => item.From === fromCurrency && item.To === toCurrency
      );

      filteredData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

      if (filteredData.length > 0) {
        const latestRate = filteredData[0];
        setLatestValue(latestRate);

        if (amount) {
          setConvertedValue(
            (parseFloat(amount) * parseFloat(latestRate.Value)).toFixed(2)
          );
          setShowConvertedValue(true); // ✅ أظهر القيمة بس لما المستخدم يضغط
        }
      } else {
        setLatestValue("No data found");
        setConvertedValue("");
      }
    }
  };

  return (
    <>
    {loading?(<div className="text-center text-lg font-semibold mt-5">
          Loading data...
        </div>):(<form className="max-w-sm md:max-w-lg mx-auto my-10">
      <div className="mb-5">
        <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
          Amount to convert
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
          From currency
        </label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
        <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
          To currency
        </label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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

      <div>
        <button
          onClick={handleShow}
          className="text-white bg-gray-900 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-600 font-medium rounded-full text-sm px-5 py-2.5 text-center"
        >
          Show
        </button>
      </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-sm">
                  From Currency
                </th>
                <th scope="col" className="px-6 py-3 text-sm">
                  To Currency
                </th>
                <th scope="col" className="px-6 py-3 text-sm">
                  Rate
                </th>
                {showConvertedValue && (
                  <th scope="col" className="px-6 py-3 text-sm">
                    Converted Value
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white text-black border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 text-base">{latestValue.From}</td>
                <td className="px-6 py-4 text-base">{latestValue.To}</td>
                <td className="px-6 py-4 text-base">{latestValue.Value}</td>
                {showConvertedValue && (
                  <td className="px-6 py-4 text-base">{convertedValue}</td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
    </form>)}
    </>
  );
}

export default CurretForm;
