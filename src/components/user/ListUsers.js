import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable } from "react-table";
import authService from "../../services/auth/authService";
import UserService from "../../services/user/userService";

const UsersList = (props) => {
  const [users, setUsers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);
  const usersRef = useRef();

  usersRef.current = users;

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    }

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    getUsers();
  }, [currentUser]);

  const onChangeSearchTitle = (e) => {
    const searchString = e.target.value;
    setSearchString(searchString);
  };

  const getUsers = () => {
    console.log(currentUser)
    if (currentUser && currentUser.payload.permission === "admin") {
      UserService.getAll()
        .then((response) => {
          setUsers(response.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      UserService.getById(currentUser.payload.id)
        .then((response) => {
          setUsers([response.data.data]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  const findByNameOrEmail = () => {
    UserService.findByNameOrEmail(searchString)
      .then((response) => {
        console.log(response)
        setUsers(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openUser = (rowIndex) => {
    const id = usersRef.current[rowIndex].id;

    console.log(props)

    props.history.push("/user/" + id);
  };

  const deleteUser = (rowIndex) => {
    const id = usersRef.current[rowIndex].id;

    UserService.remove(id).then(() => {
      props.history.push("/users");

      let newUsers = [...usersRef.current];
      newUsers.splice(rowIndex, 1);

      setUsers(newUsers);
    })
      .catch((e) => {
        console.log(e);
      });

  }

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Permission",
        accessor: "permission",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          const currentUser = authService.getCurrentUser();

          return (
            <div>
              <span onClick={() => openUser(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </span>

              {currentUser && currentUser.payload.permission === "admin" && (
                <span onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteUser(rowIdx) }}>
                  <i className="fas fa-trash action"></i>
                </span>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: users,
  });

  return (
    <div className="list row">
      {currentUser && currentUser.payload.permission === "admin" && (
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchString}
              onChange={onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByNameOrEmail}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default UsersList;
