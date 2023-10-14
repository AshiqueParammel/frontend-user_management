import React, { useEffect,useRef, useState } from 'react';
import Navbars from '../Navbar/Navbar';
import {  Button, Form} from 'react-bootstrap';
import { getLocal } from '../../Helpers/Auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../Api/Api';
import jwtDecode from 'jwt-decode';
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';



function Admin() {
 
  const modalCloser  = useRef();
  const tocken = getLocal();
  const history = useNavigate();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  async function getUserlist() {
    const request = await axios.get(`${baseUrl}userList/`);
    console.log(request,'lottaaaaa222222222');
    setUsers(request.data);
  }

  useEffect(() => {
    const decoded = jwtDecode(tocken);
    if (!decoded || !decoded.is_admin) {
      history('/');
    }
    else {
      getUserlist();
    }
  }, [history, tocken]);

  const AddUser = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !password2) {
      Swal.fire({
        title: 'Error',
        text: 'Fields cannot be blank',
        icon: 'error',
      });
      return;
    }

    if (password !== password2) {
      Swal.fire({
        title: 'Error',
        text: "Password doesn't match",
        icon: 'error',
      });
      return;
    }
    if (password.length<8){
      Swal.fire({
          title: 'Error',
          text: 'Password should have at least 8 digits!',
          icon: 'error',
        });
      return;
  }


    try {
      const response = await axios.post(
        `${baseUrl}register/`,
        {
          username: username,
          email: email,
          password: password,
          password2: password2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).catch(()=>{
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
        });
    });

      if (response.status === 200) {
        getUserlist();
        modalCloser.current.click()
          Swal.fire({
            title: 'Success',
            text: 'Sign Up successfully!',
            icon: 'success',
          });
        
        
        history('/admin');
      }

      else if (response.status === 404) {
        response.json()
        .then(data => {
  
            Swal.fire({
              title: 'Error',
              text: data.text,
              icon: 'error',
            });
          })
      }

      else {
        alert(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }


  };



  const UpdateUser = async (index, e) => {
    e.preventDefault();
    const user = users[index];

    // Get the updated values from the state
    const updatedUsername = username || user.username;
    const updatedEmail = email || user.email;
    const updatedPassword = password || user.password;
    console.log(users,'sahalllllllllllllllllllllllllllllll');


    // Validate if any field is changed
    if (user.username === updatedUsername && user.email === updatedEmail && !updatedPassword) {
      Swal.fire({
        title: 'Error',
        text: 'No changes made!',
        icon: 'error',
      });
      return;
    }


    try {
      const response = await axios.put(
        `${baseUrl}userDetails/${user.id}/`,
        {
          username: updatedUsername,
          email: updatedEmail,
          password: updatedPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data =response.data
        if (data.status ===404){
          Swal.fire({
            title: 'Error',
            text: data.text,
            icon: 'error', 
          });
        history('/admin');
        }
        else{
          Swal.fire({
            title: 'success',
            text: 'updated successfully!',
            icon: 'success',
        });
        
        history('/admin');

        }
        getUserlist();
      }
      else if (response.status === 404) {
        response.json()
          .then(data => {
            Swal.fire({
              title: 'Error',
              text: data.text,
              icon: 'error',
            });
          })
          .catch(error => {
            Swal.fire({
              title: 'Error',
              text: 'Something went wrong. Please try again later.',
              icon: 'error',
            });
          });
      }
      else {
        alert(`Error: ${response.status}`);
      }
    } catch (error) {
      //   console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');

    if (confirmed) {
      try {
        await axios.delete(`${baseUrl}userDetails/${userId}/`);
        getUserlist();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const searchUser = async (keyword) => {
    if (keyword) {
      const request = await axios.get(`${baseUrl}userList/?search=${keyword}`);
      setUsers(request.data);
    } else {
      getUserlist();
    }
  };




  return (
    <div>
      <Navbars heading={'Admin'} />
      <div className="d-flex justify-content-end container-fluid">
        <Button type="button"className="btn btn-warning me-3 my-3"data-toggle="modal"data-target="#exampleModal" >
          Add User
        </Button>
        <input type="text"className="form-control w-25 my-2 ms-auto"onChange={(e) => searchUser(e.target.value)}placeholder="Search here"/>
      </div>
      
      <div  ref={modalCloser}className= "modal fade" id="exampleModal"tabIndex="-1"role="dialog"aria-labelledby="exampleModalLabel"aria-hidden="true" >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <Form onSubmit={AddUser}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add User
                </h5>
                <Button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </Button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'block', width: 470, padding: 20 }}>
                  <Form.Group className="py-2">
                    <Form.Control type="text"name="username" onChange={(e) => setUsername(e.target.value)}placeholder="Username"/>
                  </Form.Group>
                  <Form.Group className="py-2">
                    <Form.Control type="email" name="email"  onChange={(e) => setEmail(e.target.value)}placeholder="Email"/>
                  </Form.Group>
                  <Form.Group className="py-2">
                    <Form.Control type="password"name="password" onChange={(e) => setPassword(e.target.value)}placeholder="Password"/>
                  </Form.Group>
                  <Form.Group className="py-2">
                    <Form.Control type="password"name="password2" onChange={(e) => setPassword2(e.target.value)}placeholder="Confirm Password"/>
                  </Form.Group>
                  <Form.Group></Form.Group>
                </div>
              </div>
              <div className="modal-footer">
                <Button type="button" className="btn btn-secondary" data-dismiss="modal">
                  Close
                </Button>
                <Button variant="primary" className="my-4" type="submit">
                  Add User
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      
      <div className="card cards recent-sales overflow-auto mx-3">
        <MDBTable align="middle">
          <MDBTableHead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Is active</th>
              <th scope="col">Actions</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src=""
                        alt=""
                        style={{ width: '45px', height: '45px' }}
                        className="rounded-circle"
                      />
                      <div className="ms-3">
                        <p className="fw-bold mb-1">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-muted mb-0">{user.email}</p>
                  </td>
                  <td>
                    {user.is_active ? (
                      <MDBBadge color="primary" pill>
                        NO Active
                      </MDBBadge>
                    ) : (
                      <MDBBadge color="success" pill>
                        Active
                      </MDBBadge>
                    )}
                  </td>
                  <td>
                    <Button
                      type="button"
                      className="btn btn-primary"
                      data-toggle="modal"
                      data-target={`#exampleModal${index}`}
                    >
                      <i className="fas fa-edit" />
                    </Button>
                    <div  className={'modal fade show'}id={`exampleModal${index}`}tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true"> 

                    
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <Form onSubmit={(e) => UpdateUser(index, e)}>
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">
                                Edit User
                              </h5>
                              <Button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </Button>
                            </div>
                            <div className="modal-body">
                              <Form.Group className="py-2">
                                <Form.Control
                                  type="text"
                                  name="username"
                                  placeholder="Username"
                                  defaultValue={user.username}
                                  onChange={(e) => setUsername(e.target.value)}
                                />
                              </Form.Group>
                              <Form.Group className="py-2">
                                <Form.Control
                                  type="email"
                                  name="email"
                                  placeholder="Email"
                                  defaultValue={user.email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </Form.Group>
                              <Form.Group className="py-2">
                                <Form.Control
                                  type="password"
                                  name="password"
                                  placeholder="Password"
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </Form.Group>
                            </div>
                            <div className="modal-footer">
                              <Button type="button" className="btn btn-secondary" data-dismiss="modal">
                                Close
                              </Button>
                              <Button type="submit" className="btn btn-primary">
                                Update
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </div>
                      
                    </div>
                    <Button onClick={() => deleteUser(user.id)} className="btn btn-danger ms-1">
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </MDBTableBody>
        </MDBTable>
      </div>
    </div>
  );
}

export default Admin