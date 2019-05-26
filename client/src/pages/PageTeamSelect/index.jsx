import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Button from "../../common/Button";
import SectionInfo from "../../modules/SectionInfo";
import PageTitle from "../../modules/PageTitle";
import Header from "../../common/Header";
import { getCookie } from "tiny-cookie";
import { SET_USER_DEPARTMENT, GET_ALL_DEPARTMENTS } from "../../constants";
import { checkTokenTime, checkIsBanned } from "../../helpers/requests";
// import UserDataContext from "../../contexts/UserDataContext";

const getAccountOptions = departments => {
  return departments.map(department => {
    return { label: department.title, value: department._id };
  });
};

const setUserDepartment = departmentId => {
  // checkIsBanned(sessionStorage.getItem("banned"));
  // checkTokenTime(sessionStorage.getItem("tokenTimeOver"));
  const userId = sessionStorage.getItem("id");
  return axios
    .put(
      `${SET_USER_DEPARTMENT(userId)}`,
      // `https://forge-development.herokuapp.com/api/users/${sessionStorage.getItem("id")}`,
      { newDepartment: departmentId },
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
      },
    )
    .catch(error => console.log(error));
};

const PageTeamSelect = props => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // checkIsBanned(sessionStorage.getItem("banned"));
    // checkTokenTime(sessionStorage.getItem("tokenTimeOver"));
    const fetchData = async () => {
      const result = await axios(
        // "https://forge-development.herokuapp.com/api/departments/",
        GET_ALL_DEPARTMENTS,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        },
      );

      setOptions(getAccountOptions(result.data));
    };

    fetchData();
  }, []);

  return (
    <>
      <Header isActive={true} isAdmin={false} hasDepartment={false} location={props} />
      <main className="select-main_section">
        <PageTitle
          title={`Hello, ${sessionStorage.getItem("firstName")} ${sessionStorage.getItem(
            "lastName",
          )}`}
        />
        <SectionInfo
          infoText="Select your team to start knowledge sharing and
                having some coffee:"
        />
        <div className="select-dropdown_container">
          <Dropdown
            options={options}
            selectedValue={selectedDepartmentId}
            onSelect={setSelectedDepartmentId}
          />
        </div>

        <Button
          onClick={async () => {
            await setUserDepartment(selectedDepartmentId);
            props.history.push("/subscriptions");
          }}
          disabled={!selectedDepartmentId}
          text="Accept"
          type="primary"
        />
      </main>
    </>
  );
};

export default withRouter(PageTeamSelect);
