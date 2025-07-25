'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, ShoppingCart, Shirt, MessageCircle } from 'lucide-react';
import PieChart from '../PieChart';
import BarChart from '../BarChart';
import LineChart from '../LineChart';
import './styles.css';

// const lineData = [
//   {
//     "id": "japan",
//     "color": "hsl(244, 70%, 50%)",
//     "data": [
//       {
//         "x": "plane",
//         "y": 177
//       },
//       {
//         "x": "helicopter",
//         "y": 178
//       },
//       {
//         "x": "boat",
//         "y": 207
//       },
//       {
//         "x": "train",
//         "y": 142
//       },
//       {
//         "x": "subway",
//         "y": 269
//       },
//       {
//         "x": "bus",
//         "y": 96
//       },
//       {
//         "x": "car",
//         "y": 197
//       },
//       {
//         "x": "moto",
//         "y": 290
//       },
//       {
//         "x": "bicycle",
//         "y": 134
//       },
//       {
//         "x": "horse",
//         "y": 55
//       },
//       {
//         "x": "skateboard",
//         "y": 160
//       },
//       {
//         "x": "others",
//         "y": 253
//       }
//     ]
//   },
//   {
//     "id": "france",
//     "color": "hsl(244, 70%, 50%)",
//     "data": [
//       {
//         "x": "plane",
//         "y": 269
//       },
//       {
//         "x": "helicopter",
//         "y": 255
//       },
//       {
//         "x": "boat",
//         "y": 165
//       },
//       {
//         "x": "train",
//         "y": 57
//       },
//       {
//         "x": "subway",
//         "y": 55
//       },
//       {
//         "x": "bus",
//         "y": 137
//       },
//       {
//         "x": "car",
//         "y": 104
//       },
//       {
//         "x": "moto",
//         "y": 12
//       },
//       {
//         "x": "bicycle",
//         "y": 56
//       },
//       {
//         "x": "horse",
//         "y": 209
//       },
//       {
//         "x": "skateboard",
//         "y": 20
//       },
//       {
//         "x": "others",
//         "y": 102
//       }
//     ]
//   },
//   {
//     "id": "us",
//     "color": "hsl(17, 70%, 50%)",
//     "data": [
//       {
//         "x": "plane",
//         "y": 88
//       },
//       {
//         "x": "helicopter",
//         "y": 250
//       },
//       {
//         "x": "boat",
//         "y": 69
//       },
//       {
//         "x": "train",
//         "y": 277
//       },
//       {
//         "x": "subway",
//         "y": 127
//       },
//       {
//         "x": "bus",
//         "y": 281
//       },
//       {
//         "x": "car",
//         "y": 207
//       },
//       {
//         "x": "moto",
//         "y": 37
//       },
//       {
//         "x": "bicycle",
//         "y": 127
//       },
//       {
//         "x": "horse",
//         "y": 40
//       },
//       {
//         "x": "skateboard",
//         "y": 124
//       },
//       {
//         "x": "others",
//         "y": 69
//       }
//     ]
//   },
//   {
//     "id": "germany",
//     "color": "hsl(330, 70%, 50%)",
//     "data": [
//       {
//         "x": "plane",
//         "y": 298
//       },
//       {
//         "x": "helicopter",
//         "y": 70
//       },
//       {
//         "x": "boat",
//         "y": 156
//       },
//       {
//         "x": "train",
//         "y": 152
//       },
//       {
//         "x": "subway",
//         "y": 127
//       },
//       {
//         "x": "bus",
//         "y": 229
//       },
//       {
//         "x": "car",
//         "y": 217
//       },
//       {
//         "x": "moto",
//         "y": 61
//       },
//       {
//         "x": "bicycle",
//         "y": 143
//       },
//       {
//         "x": "horse",
//         "y": 209
//       },
//       {
//         "x": "skateboard",
//         "y": 58
//       },
//       {
//         "x": "others",
//         "y": 293
//       }
//     ]
//   },
//   {
//     "id": "norway",
//     "color": "hsl(203, 70%, 50%)",
//     "data": [
//       {
//         "x": "plane",
//         "y": 204
//       },
//       {
//         "x": "helicopter",
//         "y": 287
//       },
//       {
//         "x": "boat",
//         "y": 249
//       },
//       {
//         "x": "train",
//         "y": 111
//       },
//       {
//         "x": "subway",
//         "y": 20
//       },
//       {
//         "x": "bus",
//         "y": 79
//       },
//       {
//         "x": "car",
//         "y": 175
//       },
//       {
//         "x": "moto",
//         "y": 13
//       },
//       {
//         "x": "bicycle",
//         "y": 54
//       },
//       {
//         "x": "horse",
//         "y": 2
//       },
//       {
//         "x": "skateboard",
//         "y": 63
//       },
//       {
//         "x": "others",
//         "y": 277
//       }
//     ]
//   }
// ]

const StatCard = ({ stat, Icon }) => {
  return (
    <Card className="flex items-center gap-4 p-4 shadow-md border rounded-md">
      <div className="relative flex items-center justify-center w-20 h-20">
        <Progress value={stat.progress} className="absolute w-full h-full rounded-full" />
        <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
          <Icon className="w-5 h-5 text-gray-700" />
        </span>
      </div>
      <div>
        <div className="text-xs uppercase font-bold text-gray-500">{stat.label}</div>
        <div className="text-xl font-bold">{stat.stats}</div>
      </div>
    </Card>
  );
};

const Dashboard = () => {

  const [userList, setUserList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [pieColorChartData, setPieColorChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [barChartKeys, setBarChartKeys] = useState([]);
  const [ordersTimelineData, setOrdersTimelineData] = useState([]);
  const [usersTimelineData, setUsersTimelineData] = useState([]);

  const formatPieData = (data) => {
    const categoryData = {};
    data.forEach(element => {
      if (Object.keys(categoryData).includes(element.material)) {
        categoryData[element.material] += 1;
      } else {
        categoryData[element.material] = 1;
      }
    });
    // console.log(categoryData);
    const chatData = Object.keys(categoryData).map((key) => {
      return {
        id: key,
        label: key,
        value: categoryData[key],
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
      }
    })
    // console.log(chatData);
    setPieChartData(chatData);
  }

  const formatColorPieData = (data) => {
    const categoryData = {};
    data.forEach(element => {
      if (Object.keys(categoryData).includes(element.color)) {
        categoryData[element.color] += 1;
      } else {
        categoryData[element.color] = 1;
      }
    });
    // console.log(categoryData);
    const chatData = Object.keys(categoryData).map((key) => {
      return {
        id: key,
        label: key,
        value: categoryData[key],
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
      }
    })
    // console.log(chatData);
    setPieColorChartData(chatData);
  }

  const formatOrdersTimelineData = (data) => {
    const ordersData = {};

    // Find the oldest date
    const dates = data.map(order => new Date(order.createdAt));
    const oldestDate = new Date(Math.min.apply(null, dates));

    // Use the current date as the latest date
    const latestDate = new Date();

    // Create an array of dates for every day between the oldest date and now
    for (let d = new Date(oldestDate); d <= latestDate; d.setDate(d.getDate() + 1)) {
      ordersData[new Date(d).toDateString()] = 0;
    }

    // Count the number of orders for each date
    data.forEach(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      if (ordersData[orderDate] !== undefined) {
        ordersData[orderDate] += 1;
      }
    });

    const chartData = Object.keys(ordersData).map(date => ({
      x: date,
      y: ordersData[date]
    }));

    return [{
      "id": 'No. of Orders',
      "data": chartData,
      "color": 'hsl(0, 70%, 50%)'
    }];
  }

  const formatUsersTimelineData = (data) => {
    const usersData = {};

    // Find the oldest date
    const dates = data.map(user => new Date(user.createdAt));
    const oldestDate = new Date(Math.min.apply(null, dates));

    // Use the current date as the latest date
    const latestDate = new Date();

    // Create an array of dates for every day between the oldest date and now
    for (let d = new Date(oldestDate); d <= latestDate; d.setDate(d.getDate() + 1)) {
      usersData[new Date(d).toDateString()] = 0;
    }

    // Count the number of orders for each date
    data.forEach(user => {
      const userDate = new Date(user.createdAt).toDateString();
      if (usersData[userDate] !== undefined) {
        usersData[userDate] += 1;
      }
    });

    const chartData = Object.keys(usersData).map(date => ({
      x: date,
      y: usersData[date]
    }));

    return [{
      "id": 'No. of Users',
      "data": chartData,
      "color": 'hsl(0, 70%, 50%)'
    }];
  }

  const formBarData = (data) => {
    setBarChartData(
      data.map(item => (
        {
          name: item.title,
          stock: item.stock
        }
      ))
    )

    console.log(data.map(item => (
      {
        name: item.title,
        stock: item.stock
      }
    )));

    setBarChartKeys(
      data.map(item => (
        item.title
      ))
    )
  }

  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/getall`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUserList(data);
        const temp = formatUsersTimelineData(data);
        console.log(temp);
        setUsersTimelineData(temp);
      })
  }

  const fetchOrders = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/getall`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setOrderList(data);
        const temp = formatOrdersTimelineData(data);
        console.log(temp);
        setOrdersTimelineData(temp);
      })
  }

  const fetchProducts = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`)
      .then(res => res.json())
      .then(data => {
        setProductList(data);
        console.log(data);
        formatPieData(data);
        formatColorPieData(data);
        formBarData(data);
      })
  }

  const fetchFeedbacks = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback/getall`)
      .then(res => res.json())
      .then(data => {
        setFeedbackList(data);
      })
  }

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchProducts();
    fetchFeedbacks();
  }, [])


  return (
    <div className="p-6">
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard stat={{ label: 'Total Users', stats: userList.length, progress: 10, color: 'blue' }} Icon={User} />
          <StatCard stat={{ label: 'Total Orders', stats: orderList.length, progress: 35, color: 'cyan' }} Icon={ShoppingCart} />
          <StatCard stat={{ label: 'Total Products', stats: productList.length, progress: 60, color: 'pink' }} Icon={Shirt} />
          <StatCard stat={{ label: 'Total Feedbacks', stats: 0, progress: 0, color: 'yellow' }} Icon={MessageCircle} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[40vh]">
            <h3 className="text-lg font-semibold mb-2">Product Color Distribution</h3>
            <PieChart data={pieColorChartData} />
          </div>
          <div className="h-[40vh]">
            <h3 className="text-lg font-semibold mb-2">Product Material Distribution</h3>
            <PieChart data={pieChartData} />
          </div>
          <div className="h-[40vh]">
            <LineChart data={ordersTimelineData} />
          </div>
          <div className="h-[40vh]">
            <LineChart data={usersTimelineData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;