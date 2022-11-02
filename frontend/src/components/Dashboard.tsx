
import React, { useState } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import { Decoded } from '../../types/frontend.types';
 
const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const history = useHistory();

    (async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const { name, exp }: Decoded = jwt_decode(response.data.accessToken);
            setName(name);
            setExpire(exp);
        } catch (error) {
            if (error.response) {
                history.push("/");
            }
        }
    })();
    (async () => {
        const response = await axiosJWT.get('http://localhost:5000/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setUsers([response.data]);
    })();
 
    // const refreshToken = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/token');
    //         setToken(response.data.accessToken);
    //         const { name, exp }: Decoded = jwt_decode(response.data.accessToken);
    //         setName(name);
    //         setExpire(exp);
    //     } catch (error) {
    //         if (error.response) {
    //             history.push("/");
    //         }
    //     }
    // }
 
    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (+expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const { name, exp }: Decoded = jwt_decode(response.data.accessToken);
            setName(name);
            setExpire(exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
 
    // const getUsers = async () => {
    //     const response = await axiosJWT.get('http://localhost:5000/users', {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     });
    //     setUsers([response.data]);
    // }
 
    return (
        <div className="container mt-5">
            <h1>Welcome Back: {name}</h1>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
 
                </tbody>
            </table>
        </div>
    )
}
 
export default Dashboard