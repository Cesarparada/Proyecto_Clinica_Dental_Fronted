import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../../_services/userService";
import { DataListTable } from "../../components";
import "./Admin.scss";

export default function Admin() {
  //hooks
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPages, setUsersPages] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const isAdmin = authState.userInfo.role == "admin";

  useEffect(() => {
    if (isAdmin) {
      getAllUsers(authState.userToken, usersPage);
    } else {
      navigate("/");
    }
  }, [usersPage]);

  const handleUsersList = (e) => {
    const { page, dataId } = e.currentTarget.dataset;
    handleUsersListPagination(page);
    handleSingleUser(dataId);
  };

  const handleUsersListPagination = (page) => {
    console.log(page);
    switch (page) {
      case "next":
        return setUsersPage((page) => page + 1);
      case "prev":
        return setUsersPage((page) => page - 1);
      case "inicio":
        return setUsersPage(1);
      case "final":
        return setUsersPage(usersPages);
    }
  };

  const handleSingleUser = (dataId) => {
    console.log(dataId);
  };

  const getAllUsers = async (token, page) => {
    try {
      const response = await userService.getAllUsers(token, page);
      setUsers(response.results);
      setUsersCount(response.info.total_results);
      setUsersPages(response.info.total_pages);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isAdmin && (
        <>
          <div className="panel-admin">
            <h1>Usuarios Registrados</h1>
         
          <br />

          <DataListTable
            data={users}
            title="Users"
            count={usersCount}
            headers={[
              "ID",
              "Nombre",
              "Apellidos",
              "Email",
              "Fecha de Nacimiento",
            ]}
            attributes={[
              "id",
              "nombre",
              "apellidos",
              "email",
              "fecha_de_nacimiento",
            ]}
            pagination={{
              page: usersPage,
              totalPages: usersPages,
              count: usersCount,
            }}
            onChange={handleUsersList}
          />
      </div>   </>
      )}
    </>
  );
}
