

import { MenuGroup } from "./_metronic/layout/components/sidebar/sidebar-menu/types";

export const menus: MenuGroup[] = [
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
        name: 'Completed Rides',
        svg_location: 'general',
        icon: 'gen024',
        route: 'rides/completedrides',
      
      },
      // {
      //   name: 'Current Rides',
      //   svg_location: 'files',
      //   icon: 'fil011',
      //   route: 'rides/currentrides',
       
      // },
      {
        name: 'MIS Reports',
        svg_location: 'abstract',
        icon: 'abs045',
        route: 'reportspage/reports'
      },
      {
        name: 'Customers',
        svg_location: 'graphs',
        icon: 'gra001',
        route: 'polls'
      },
      // {
      //   name: 'Reports',
      //   svg_location: 'graphs',
      //   icon: 'gra007',
      //   route: '',
      //   submenu: [
      //     {
      //       name: 'Transactions',
      //       svg_location: '',
      //       icon: '',
      //       route: 'reports/transactions'
      //     },
      //     {
      //       name: 'Expected Settlements',
      //       svg_location: '',
      //       icon: '',
      //       route: 'expected/settlements',
      //     },
      //     {
      //       name: 'Settlement History',
      //       svg_location: '',
      //       icon: '',
      //       route: 'settlement/history',
      //     }
      //   ],
      // },
      // {
      //   name: 'Setings',
      //   svg_location: 'technology',
      //   icon: 'teh001',
      //   route: '',
      //   submenu: [
      //     {
      //       name: 'Change Password',
      //       svg_location: '',
      //       icon: '',
      //       route: 'change-password'
      //     },
      //     {
      //       name: 'Notification Preferences',
      //       svg_location: '',
      //       icon: '',
      //       route: 'notification-preferences',
      //     }
      //   ],
      // },
      // {
      //   name: 'Support',
      //   svg_location: 'communication',
      //   icon: 'com003',
      //   route: '',
      //   submenu: [
      //     {
      //       name: 'Helpdesk',
      //       svg_location: '',
      //       icon: '',
      //       route: 'helpdesk'
      //     },
      //     {
      //       name: 'User Guide',
      //       svg_location: '',
      //       icon: '',
      //       route: 'user-guide',
      //     }
      //   ],
      // }
    ],
  },
];










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
//         name: 'Financial Management',
//         svg_location: 'finance',
//         icon: 'fin001',
//         route: '',
//         submenu: [
//           {
//             name: 'Collection',
//             svg_location: 'general',
//             icon: '',
//             route: '',
//             submenu: [
//               {
//                 name: 'Create Invoice',
//                 svg_location: '',
//                 icon: '',
//                 route: '/invoice/create',
//               },
//               {
//                 name: 'All Invoices',
//                 svg_location: '',
//                 icon: '',
//                 route: 'all-invoice/list',
//               },
//               {
//                 name: 'Outsanding',
//                 svg_location: '',
//                 icon: '',
//                 route: 'outstanding/list',
//               },
//               {
//                 name: 'Collect Payment',
//                 svg_location: '',
//                 icon: '',
//                 route: 'payment/collection',
//               },
//             ]
//           },
//           {
//             name: 'Expenses',
//             svg_location: 'general',
//             icon: '',
//             route: '',
//             submenu: [
//               {
//                 name: 'Expenses',
//                 svg_location: '',
//                 icon: '',
//                 route: 'expenses',
//               },
//               {
//                 name: 'Income',
//                 svg_location: '',
//                 icon: '',
//                 route: 'income',
//               },
//               {
//                 name: 'Assets',
//                 svg_location: '',
//                 icon: '',
//                 route: 'assets',
//               },
//               {
//                 name: 'Liabilities',
//                 svg_location: '',
//                 icon: '',
//                 route: 'liabilities',
//               }
//             ]
//           },
//           {
//             name: 'Payables',
//             svg_location: 'general',
//             icon: '',
//             route: '',
//             submenu: [
//               {
//                 name: 'Add Payables',
//                 svg_location: '',
//                 icon: '',
//                 route: 'payables',
//               },
//               {
//                 name: 'All Invoices',
//                 svg_location: '',
//                 icon: '',
//                 route: 'all-invoices',
//               }
//             ]
//           },
//         ],
//       },
//       {
//         name: 'Customer Management',
//         svg_location: 'communication',
//         icon: 'com014',
//         route: '',
//         submenu: [
//           {
//             name: 'Payer',
//             svg_location: '',
//             icon: '',
//             route: 'payer/list'
//           },
//           {
//             name: 'Broadcast to Payer',
//             svg_location: '',
//             icon: '',
//             route: 'broadcast-to-pauer',
//           },
//           {
//             name: 'Payer Document',
//             svg_location: '',
//             icon: '',
//             route: 'payer-document',
//           },
//           {
//             name: 'Customer Connect',
//             svg_location: '',
//             icon: '',
//             route: 'customer-connect',
//           }
//         ],
//       },
//       {
//         name: 'Manage',
//         svg_location: 'general',
//         icon: 'gen024',
//         route: '',
//         submenu: [
//           {
//             name: 'Operators',
//             svg_location: '',
//             icon: '',
//             route: 'operators'
//           },
//           {
//             name: 'Vendor',
//             svg_location: '',
//             icon: '',
//             route: 'Vendor',
//           },
//           {
//             name: 'Products',
//             svg_location: '',
//             icon: '',
//             route: '',
//           },
//           {
//             name: 'Diagnostics Tests',
//             svg_location: '',
//             icon: '',
//             route: '',
//           }
//         ],
//       },
//       {
//         name: 'Form Process',
//         svg_location: 'files',
//         icon: 'fil011',
//         route: '',
//         submenu: [
//           {
//             name: 'Applications',
//             svg_location: '',
//             icon: '',
//             route: 'form/application'
//           },
//           {
//             name: 'For Collection',
//             svg_location: '',
//             icon: '',
//             route: 'collection'
//           },
//           {
//             name: 'For Survey',
//             svg_location: '',
//             icon: '',
//             route: 'survey',
//           }
//         ]
//       },
//       {
//         name: 'My Services',
//         svg_location: 'abstract',
//         icon: 'abs045',
//         route: 'my-services'
//       },
//       {
//         name: 'Polls',
//         svg_location: 'graphs',
//         icon: 'gra001',
//         route: 'polls'
//       },
//       {
//         name: 'Reports',
//         svg_location: 'graphs',
//         icon: 'gra007',
//         route: '',
//         submenu: [
//           {
//             name: 'Transactions',
//             svg_location: '',
//             icon: '',
//             route: 'reports/transactions'
//           },
//           {
//             name: 'Expected Settlements',
//             svg_location: '',
//             icon: '',
//             route: 'expected/settlements',
//           },
//           {
//             name: 'Settlement History',
//             svg_location: '',
//             icon: '',
//             route: 'settlement/history',
//           }
//         ],
//       },
//       {
//         name: 'Setings',
//         svg_location: 'technology',
//         icon: 'teh001',
//         route: '',
//         submenu: [
//           {
//             name: 'Change Password',
//             svg_location: '',
//             icon: '',
//             route: 'change-password'
//           },
//           {
//             name: 'Notification Preferences',
//             svg_location: '',
//             icon: '',
//             route: 'notification-preferences',
//           }
//         ],
//       },
//       {
//         name: 'Support',
//         svg_location: 'communication',
//         icon: 'com003',
//         route: '',
//         submenu: [
//           {
//             name: 'Helpdesk',
//             svg_location: '',
//             icon: '',
//             route: 'helpdesk'
//           },
//           {
//             name: 'User Guide',
//             svg_location: '',
//             icon: '',
//             route: 'user-guide',
//           }
//         ],
//       }
//     ],
//   },
// ];


