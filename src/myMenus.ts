

// import { MenuGroup } from "./_metronic/layout/components/sidebar/sidebar-menu/types";

// export const menus: MenuGroup[] = [
//   {
//     name: 'Home',
//     menu: [
//       {
//         name: 'Dashboard',
//         svg_location: 'general',
//         icon: 'gen025',
//         route: '/dashboard',
        
//       }
//     ],
//   },
//   {
    
//     name: 'Apps',
//     menu: [
//       {
//         name: 'Cabs',
//         svg_location: 'finance',
//         icon: 'fin001',
//         route: 'cabspage/cabs',
       
//       },
//       {
//         name: 'Drivers',
//         svg_location: 'communication',
//         icon: 'com014',
//         route: 'driverspage/drivers',
  
//       },
//       {
//         name: 'All Bookings',
//         svg_location: 'communication',
//         icon: 'com014',
//         route: 'bookingspage/allbookings',
  
//       },
//       {
//         name: 'Not started Rides',
//         svg_location: 'communication',
//         icon: 'com014',
//         route: 'bookingspage/notstarted',
  
//       },
//       {
//         name: 'Started Rides',
//         svg_location: 'communication',
//         icon: 'com014',
//         route: 'bookingspage/started',
  
//       },
//       // {
//       //   name: 'Ended Rides',
//       //   svg_location: 'communication',
//       //   icon: 'com014',
//       //   route: 'bookingspage/ended',
  
//       // },
//       {
//         name: 'Completed Rides',
//         svg_location: 'general',
//         icon: 'gen024',
//         route: 'rides/completedrides',
      
//       },
     
//     ],
//   },
// ];


import { useEffect, useState } from "react";
import { MenuGroup } from "./_metronic/layout/components/sidebar/sidebar-menu/types";

export const useMenus = () => {
  const [menus, setMenus] = useState<MenuGroup[]>([]);

  useEffect(() => {
    const roleId = localStorage.getItem('role_id'); // Fetch role_id from localStorage

    const updatedMenus: MenuGroup[] = roleId === '1'
      ? [
          {
            name: 'Home',
            menu: [
              {
                name: 'Dashboard',
                svg_location: 'general',
                icon: 'gen025',
                route: '/dashboard',
              }
            ],
          },
          {
            name: 'Apps',
            menu: [
              {
                name: 'Cabs',
                svg_location: 'finance',
                icon: 'fin001',
                route: 'cabspage/cabs',
              },
              {
                name: 'Drivers',
                svg_location: 'communication',
                icon: 'com014',
                route: 'driverspage/drivers',
              },
              {
                name: 'All Bookings',
                svg_location: 'communication',
                icon: 'com014',
                route: 'bookingspage/allbookings',
              },
              {
                name: 'Not started Rides',
                svg_location: 'communication',
                icon: 'com014',
                route: 'bookingspage/notstarted',
              },
              {
                name: 'Started Rides',
                svg_location: 'communication',
                icon: 'com014',
                route: 'bookingspage/started',
              },
              {
                name: 'Completed Rides',
                svg_location: 'general',
                icon: 'gen024',
                route: 'rides/completedrides',
              },
            ],
          },
        ]
      : roleId === '2'
      ? [
          {
            name: 'Apps',
            menu: [
              {
                name: 'All Bookings',
                svg_location: 'communication',
                icon: 'com014',
                route: 'bookingspage/alldriverbookings',
              },
            ],
          },
        ]
      : [];

    setMenus(updatedMenus);
  }, []); // Runs on mount and role_id changes

  return menus;
};
