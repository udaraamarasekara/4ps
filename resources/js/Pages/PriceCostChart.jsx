import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function PriceCostChart({start,end,itemName,filter}) {
  const [chartData, setChartData] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    itemName &&
    fetchData(page);
  }, [page,filter]);

  const fetchData = async (pageNumber) => {
    const res = await axios.get(route('productClassification.priceCostVariation'), {
      params: { 
        item: itemName,
        page: pageNumber,
        from:start,
        to:end
      }
    });
    console.log(res.data.data);
    const labels = res.data.data.map(item =>  new Date(item.created_at).toLocaleDateString());
    const prices = res.data.data.map(item => item.price);
    const costs = res.data.data.map(item => item.cost);

    setLastPage(res.data.last_page);

    setChartData({
      labels,
      datasets: [
        {
          label: "Price",
          data: prices,
          borderColor: "rgb(59,130,246)",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.3
        },
        {
          label: "Cost",
          data: costs,
          borderColor: "rgb(239,68,68)",
          backgroundColor: "rgba(239,68,68,0.2)",
          tension: 0.3
        }
      ]
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">
        Price vs Cost Over Time
      </h2>

      {chartData && <Line data={chartData} />}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
