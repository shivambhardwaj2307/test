import React from "react";

import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Backdrop, CircularProgress } from "@mui/material";
import ApiEndPoints from "../../../../Network_call/ApiEndPoints";
import ApiServices from "../../../../Network_call/apiservices";
import Breadcrumbs, {
  Breadcrumbsub,
} from "../../../../components/Common/Breadcrumb";
import MaterialTable from "../../../Tables/Table";
import { Columns, deepKeys } from "../../../ulit/commonFunction";

import { Refresh } from "@mui/icons-material";
import { timedata } from "../../../ulit/timeforGertData";

const RegistriesDashboard = ({ url, column }) => {
  // document.title = "Report | trend micro unity";
  document.title = "Report | | Secure Sight";
  const [openLoader, setOpenLoader] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    getSmartChecksData();
  }, [time]);

  const dateNow = new Date();
  const lessTime = new Date(dateNow.getTime() - time)
    .toISOString()
    .slice(0, -1);
  // const lessTimetoString = lessTime.toISOString().slice(0, -1);

  const getSmartChecksData = async () => {
    setOpenLoader(true);
    const payloadwithTime = {
      index: url,
      column: [],
      curruntTime: dateNow.toISOString(),
      lessTime: lessTime,
    };
    const payload = {
      index: url,
      column: [],
    };
    const response = await ApiServices(
      "post",
      time.length > 0 ? payloadwithTime : payload,
      ApiEndPoints.SearchData
    );

    setData(response);
    setOpenLoader(false);
  };
  function getAllKeys(data) {
    const keys = [];

    function collectKeys(obj, prefix = "") {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          collectKeys(item, `${prefix}[${index}]`);
        });
      } else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
          const newPrefix = prefix ? `${prefix}.${key}` : key;
          collectKeys(obj[key], newPrefix);
        });
      } else {
        keys.push(prefix);
      }
    }

    collectKeys(data);
    return keys;
  }
  const key = Array.from(getAllKeys(data.length > 0 && data[0]));
  const columns = Columns(key);

  return (
    <React.Fragment>
      <ToastContainer />
      {/* <div className="page-content">
        <div className="container-fluid"> */}
      {/* <Breadcrumbs title="Smart Checks" breadcrumbItem="Registries Dashboard" /> */}
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader></CardHeader>

            <CardBody>
              <Breadcrumbsub
                title="Registries Dashboard"
                breadcrumbItem={
                  <div className="d-flex">
                    <select
                      className="form-select m-1"
                      id="floatingSelectGrid"
                      aria-label="Floating label select example"
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                    >
                      <option value="">Select Time</option>
                      {timedata &&
                        timedata.map((i) => (
                          <option value={i.value}>{i.lable}</option>
                        ))}
                    </select>

                    <button
                      type="button"
                      className="btn btn-success  m-1"
                      onClick={getSmartChecksData}
                    >
                      <Refresh color="inherit" />
                    </button>
                  </div>
                }
              />
              {data.length > 0 && data && (
                <MaterialTable
                  columns={columns}
                  data={data}
                  title="Registries Dashboard"
                />
              )}
              {data.length === 0 && <div>Data Not Found!</div>}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* </div>
      </div> */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoader}
        onClick={() => setOpenLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default RegistriesDashboard;
