import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Form, Input, Button, Space, Typography,message,Select  } from 'antd';
import axios from "axios";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const validateForm = () => {
    if(!email || ! password){
      setError('Email or password are required');
      return false;
    }
    setError('');
    return true;
  }

  const handleRegister = async(event) =>{
    event.preventDefault();
    if(!validateForm()){
      return
    }
    const formDetails = new URLSearchParams();
    formDetails.append('email',email);
    formDetails.append('password',password);
    formDetails.append('role',role);
    try{
      const response = await axios.post('http://localhost:3000/auth/register', {
        email: email,
        password: password,
        role: role,
      })

      if(response){
        message.success('Register succsess, please login!', 3);
      }
      if(response.status == 401){
        setError('This user not exist')
      }
    }
    catch (error){
      console.log(error)
      setError('An error occured')
    }
  }

  const handleSubmit = async (event) =>{
    localStorage.clear();
    event.preventDefault();
    if(!validateForm()){
      return
    }
    setLoading(true)
    const formDetails = new URLSearchParams();
    formDetails.append('email',email);
    formDetails.append('password',password);
    try{
      const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formDetails,
      });
      setLoading(false);
      if(response.ok){
        const data = await response.json();
        localStorage.setItem('token',data.accessToken)
        const responseVerify = await axios.get("http://localhost:3000/auth/verify_user", {
          params: {
            token: data.accessToken,
          },
        });
        let user = responseVerify.data
        dispatch({ type: 'LOGIN', payload: user });        
        if(user.role === 'admin'){
          navigate('/admin')
        }
        else if(user.role === 'developer'){
          navigate('/')
        }
        else if(user.role === 'manager'){
          navigate('/')
        }
      }
      else{
        setLoading(false);
        setError('This user not exist')
      }
    }
    catch (error){
      console.log(error)
      setLoading(false);
      setError('An error occured')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 level={2} className="font-londrina text-5xl flex justify-center text-blue-500">Jira</h1>
      <Form layout="vertical">
      <Form.Item 
        label={<span className="font-barlow">Email</span>}
        required>          
        <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter email" 
          />
        </Form.Item>
        <Form.Item 
          label={<span className="font-barlow">Password</span>}
          required>
          <Input.Password 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
          />
          
        </Form.Item>
        <Form.Item 
          label={<span className="font-barlow">Role</span>}
          required>
          <Select
            defaultValue="admin"
            onChange={(e) => {
              console.log(e)
              setRole(e)
              console.log(role)
            }}
            options={[
              {
                value: 'admin',
                label: 'admin',
              },
              {
                value: 'manager',
                label: 'manager',
              },
              {
                value: 'developer',
                label: 'developer',
              },
            ]}
          >
          </Select>
          
        </Form.Item>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div className="flex justify-between">
          <Button type="primary" className="font-barlow" loading={loading} htmlType="submit" onClick={handleSubmit}>
            {loading ? 'Login...' : 'Login'}
          </Button>
          <Button type="link" className="font-barlow" danger disabled={loading} onClick={handleRegister}>
            {loading ? 'Login...' : 'Register'}
          </Button>
          </div>
        </Space>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </Form>
    </div>
  );
};

export default Login;
