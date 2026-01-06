import React, { useState, useEffect } from "react";
import { Card } from "antd";

import AddProducts from "./components/AddProducts";
import "./style/AddProducts.css";

const Dashboard = () => {
  return (
    <Card style={{ margin: "20px auto", borderRadius: "10px" }}>
      <AddProducts />
    </Card>
  );
};

export default Dashboard;
