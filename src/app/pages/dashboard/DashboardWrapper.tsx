import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { PageTitle } from '../../../_metronic/layout/core';
import { useIntl } from 'react-intl';

const DashboardPage: FC = () => {
  const [totalCabs, setTotalCabs] = useState<number>(0);
  const [totalDrivers, setTotalDrivers] = useState<number>(0);
  const [todaysBookings, setTodaysBookings] = useState<number>(0);
  const [upcomingRides, setUpcomingRides] = useState<number>(0);
  const [runningRides, setRunningRides] = useState<number>(0);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://cabapi.payplatter.in/api/bookings');
      const bookings = response.data;

      const today = new Date();
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      let todaysCount = 0;
      let upcomingCount = 0;
      let runningCount = 0;

      bookings.forEach((booking: any) => {
        const bookingDate = new Date(booking.booking_date);

        // Count today's bookings with "success" status
        if (booking.status === 'success' && bookingDate >= todayStart && bookingDate <= todayEnd) {
          todaysCount++;
        }

        // Count upcoming rides with "success" status and "not started" ride_status
        if (booking.status === 'success' && booking.ride_status === 'not started' && bookingDate === today) {
          upcomingCount++;
        }

        // Count running rides with "success" status and "started" ride_status
        if (booking.status === 'success' && booking.ride_status === 'started') {
          runningCount++;
        }
      });

      setTodaysBookings(todaysCount);
      setUpcomingRides(upcomingCount);
      setRunningRides(runningCount);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cabs and drivers
        const cabsResponse = await axios.get('https://cabapi.payplatter.in/api/cars');
        setTotalCabs(cabsResponse.data.length);

        const driversResponse = await axios.get('https://cabapi.payplatter.in/api/drivers');
        setTotalDrivers(driversResponse.data.length);

        // Fetch bookings
        await fetchBookings();
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>Dashboard</PageTitle>
      <div className="container mt-4">
        <div className="row g-4 justify-content-between">
          {/* Card Template */}
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
              color: 'bg-warning',
              icon: 'bi bi-arrow-right-circle',
            },
            {
              title: 'Running Rides',
              value: runningRides,
              color: 'bg-danger',
              icon: 'bi bi-lightning',
            },
          ].map((card, index) => (
            <div className="col-lg-2 col-md-3 col-6" key={index}>
              <div
                className={`card shadow rounded-lg ${card.color} text-white text-center`}
                style={{ height: '180px' }}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <i className={`${card.icon} fs-1 mb-3`}></i>
                  <h6 className="mb-2">{card.title}</h6>
                  <p className="fs-3 fw-bold mb-0">{card.value}</p>
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
