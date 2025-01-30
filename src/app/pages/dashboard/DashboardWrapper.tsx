import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { PageTitle } from '../../../_metronic/layout/core';
import { useIntl } from 'react-intl';
import { BACKEND_DOMAIN } from '../../../apiEndpoints';

const DashboardPage: FC = () => {
  const [totalCabs, setTotalCabs] = useState<number>(0);
  const [totalDrivers, setTotalDrivers] = useState<number>(0);
  const [todaysBookings, setTodaysBookings] = useState<number>(0);
  console.log(todaysBookings)
  const [upcomingRides, setUpcomingRides] = useState<number>(0);
  const [runningRides, setRunningRides] = useState<number>(0);
  const [todaysCollection, setTodaysCollection] = useState<number>(0);
  const [totalCollection, setTotalCollection] = useState<number>(0);

  // const fetchTransactions = async () => {
  //   try {
  //     // Fetch bookings data
  //     const response = await axios.get(`${BACKEND_DOMAIN}/api/bookings`);
  //     const bookings = response.data;
  
  //     console.log("All Bookings from API:", bookings); // Debug: See all bookings
  
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0); // Set to start of today
  //     const todayEnd = new Date(today);
  //     todayEnd.setHours(23, 59, 59, 999); // End of today
  
  //     let todaySum = 0;
  //     let totalSum = 0;
  
  //     const filteredBookings = bookings.filter((booking: any) => {
  //       const bookingDate = new Date(booking.booking_date);
  //       const localBookingDate = new Date(bookingDate.toISOString().split('T')[0]); // Convert to local date
  
  //       const isToday = localBookingDate.getTime() === today.getTime();
  //       const isSuccess = booking.status === 'success';
  //       const amount = Number(booking.amount) || 0;
  
  
  //       return isToday && isSuccess;
  //     });
  
  
  //     filteredBookings.forEach((booking: any) => {
  //       todaySum += Number(booking.amount) || 0;
  //     });
  
  //     // Calculate total collection (all success bookings)
  //     bookings.forEach((booking: any) => {
  //       if (booking.status === 'success') {
  //         totalSum += Number(booking.amount) || 0;
  //       }
  //     });
  

  
  //     setTodaysCollection(todaySum);
  //     setTotalCollection(totalSum);
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //   }
  // };
  
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cabs and drivers
        const cabsResponse = await axios.get(`${BACKEND_DOMAIN}/api/cars`);
        setTotalCabs(cabsResponse.data.length);
    

        const driversResponse = await axios.get(`${BACKEND_DOMAIN}/api/drivers`);
        setTotalDrivers(driversResponse.data.length);

        // Fetch bookings
        await fetchBookings();

        // Fetch transactions for collections
        // await fetchTransactions();
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BACKEND_DOMAIN}/api/bookings`);
      const bookings = response.data;
  
      console.log("All Bookings from API:", bookings); // Debugging output
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today in local time
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999); // End of today
  
      let todaysCount = 0;
      let upcomingCount = 0;
      let runningCount = 0;
      let todaySum = 0;
      let totalSum = 0;
  
      bookings.forEach((booking: any) => {
        // Convert UTC `booking_date` to local time
        const bookingDateUTC = new Date(booking.booking_date);
        const bookingDateLocal = new Date(
          bookingDateUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        ); // Adjust for Indian timezone
  
        console.log(`Booking ID: ${booking.booking_id}, Date: ${bookingDateUTC}, LocalDate: ${bookingDateLocal}`);
  
        const isToday = bookingDateLocal.getDate() === today.getDate() &&
                        bookingDateLocal.getMonth() === today.getMonth() &&
                        bookingDateLocal.getFullYear() === today.getFullYear();
  
        const amount = booking.amount ? Number(booking.amount) : 0;
  
        // ✅ Count today's successful bookings
        if (booking.status === 'success' && isToday) {
          todaysCount++;
          todaySum += amount;
        }
  
        // ✅ Count today's upcoming rides
        if (booking.status === 'success' && booking.ride_status === 'not started' && isToday) {
          upcomingCount++;
        }
  
        // ✅ Count running rides
        if (booking.status === 'success' && booking.ride_status === 'running' && isToday) {
          runningCount++;
        }
  
        // ✅ Sum of all successful bookings for total collection
        if (booking.status === 'success') {
          totalSum += amount;
        }
      });
  
      // Update state values
      setTodaysBookings(todaysCount);
      setUpcomingRides(upcomingCount);
      setRunningRides(runningCount);
      setTodaysCollection(todaySum);
      setTotalCollection(totalSum);
  
      console.log(`Final Today Collection: ${todaySum}`);
      console.log(`Final Total Collection: ${totalSum}`);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  

  return (
    <>
      <PageTitle breadcrumbs={[]}>Dashboard</PageTitle>
      <div className="container mt-4">
        <div className="row g-4 justify-content-between">
          {/* Existing Cards */}
          {[
            {
              title: 'Total Cabs',
              value: totalCabs,
              color: 'bg-primary',
              icon: 'bi bi-truck',
            },
            {
              title: 'Total Drivers',
              value: totalDrivers,
              color: 'bg-info',
              icon: 'bi bi-person-badge',
            },
            {
              title: "Today's Bookings",
              value: todaysBookings,
              color: 'bg-success',
              icon: 'bi bi-calendar-check',
            },
            {
              title: 'Todays Upcoming Rides',
              value: upcomingRides,
              color: 'bg-dark',
              icon: 'bi bi-arrow-right-circle',
            },
            {
              title: 'Running Rides',
              value: runningRides,
              color: 'bg-danger',
              icon: 'bi bi-lightning',
            },
            // New Cards
            {
              title: "Today's bookings Collection",
              value: `₹${(todaysCollection || 0).toFixed(2)}`, // Ensure it's always a number
              color: 'bg-info',
              icon: 'bi bi-cash',
            },
            {
              title: 'Total bookings Collection',
              value: `₹${(totalCollection || 0).toFixed(2)}`, // Ensure it's always a number
              color: 'bg-warning',
              icon: 'bi bi-wallet',
            },
            
          ].map((card, index) => (
            <div className="col-lg-2 col-md-3 col-6" key={index}>
              <div
                className={`card shadow rounded-lg ${card.color} text-white text-center`}
                style={{ height: '180px' }}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <i className={`${card.icon} fs-1 mb-3`}></i>
                  <h6 className="mb-2 text-white">{card.title}</h6>
                  <p className="fs-3 fw-bold mb-0 text-white">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};






const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
