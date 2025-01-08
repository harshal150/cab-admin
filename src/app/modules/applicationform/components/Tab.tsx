import React, { useState } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";

const TabbedComponent: React.FC = () => {
  const [primaryTab, setPrimaryTab] = useState<string>("primary1");
  const [secondaryTab, setSecondaryTab] = useState<string>("secondary1");

  const handlePrimaryTabSelect = (tab: string | null) => {
    if (tab) {
      setPrimaryTab(tab);
      setSecondaryTab("secondary1"); // Reset secondary tab on primary tab change
    }
  };

  const handleSecondaryTabSelect = (tab: string | null) => {
    if (tab) {
      setSecondaryTab(tab);
    }
  };

  const renderTable = () => {
    if (primaryTab === "primary1") {
      if (secondaryTab === "secondary1") {
        return (
          <Table
            striped
            bordered
            hover
            style={{
              marginTop: "20px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#336699", color: "#ffffff" }}>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John</td>
                <td>28</td>
                <td>New York</td>
              </tr>
            </tbody>
          </Table>
        );
      } else if (secondaryTab === "secondary2") {
        return (
          <Table
            striped
            bordered
            hover
            style={{
              marginTop: "20px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#336699", color: "#ffffff" }}>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Phone</td>
                <td>$699</td>
                <td>Electronics</td>
              </tr>
            </tbody>
          </Table>
        );
      }
    } else if (primaryTab === "primary2") {
      return (
        <Table
          striped
          bordered
          hover
          style={{
            marginTop: "20px",
            fontSize: "14px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#336699", color: "#ffffff" }}>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>The Great Gatsby</td>
              <td>F. Scott Fitzgerald</td>
              <td>1925</td>
            </tr>
          </tbody>
        </Table>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f8fa",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Tabs
        activeKey={primaryTab}
        onSelect={handlePrimaryTabSelect}
        className="mb-3"
        style={{
          fontWeight: "500",
          fontSize: "16px",
          color: "#336699",
          borderBottom: "2px solid #d8f1ff",
        }}
      >
        <Tab
          eventKey="primary1"
          title={
            <span
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: primaryTab === "primary1" ? "#d8f1ff" : "transparent",
                color: primaryTab === "primary1" ? "#224466" : "#336699",
                transition: "all 0.3s ease",
              }}
            >
              Primary Tab 1
            </span>
          }
        >
          <Tabs
            activeKey={secondaryTab}
            onSelect={handleSecondaryTabSelect}
            className="mb-3"
          >
            <Tab
              eventKey="secondary1"
              title={
                <span
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor:
                      secondaryTab === "secondary1" ? "#bbcddf" : "transparent",
                    color: secondaryTab === "secondary1" ? "#224466" : "#336699",
                    transition: "all 0.3s ease",
                  }}
                >
                  Secondary Tab 1
                </span>
              }
            >
              {renderTable()}
            </Tab>
            <Tab
              eventKey="secondary2"
              title={
                <span
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor:
                      secondaryTab === "secondary2" ? "#bbcddf" : "transparent",
                    color: secondaryTab === "secondary2" ? "#224466" : "#336699",
                    transition: "all 0.3s ease",
                  }}
                >
                  Secondary Tab 2
                </span>
              }
            >
              {renderTable()}
            </Tab>
          </Tabs>
        </Tab>
        <Tab
          eventKey="primary2"
          title={
            <span
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: primaryTab === "primary2" ? "#d8f1ff" : "transparent",
                color: primaryTab === "primary2" ? "#224466" : "#336699",
                transition: "all 0.3s ease",
              }}
            >
              Primary Tab 2
            </span>
          }
        >
          {renderTable()}
        </Tab>
      </Tabs>
    </div>
  );
};

export default TabbedComponent;
