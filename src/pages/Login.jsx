import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Input, Button, Space, Typography,message  } from 'antd';

const { Title } = Typography;
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const validateForm = () => {
    if(!username || ! password){
      setError('Username or password are required');
      return false;
    }
    setError('');
    return true;
  }

  const handleRegister = async(event) =>{
    
  }

  const handleSubmit = async (event) =>{
   
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <Title level={2} style={{ class: "" }}>JIRA</Title>
      <Form layout="vertical">
        <Form.Item label="Username" required>
          <Input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter username" 
          />
        </Form.Item>
        <Form.Item label="Password" required>
          <Input.Password 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
          />
        </Form.Item>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" loading={loading} htmlType="submit" onClick={handleSubmit}>
            {loading ? 'Login...' : 'Login'}
          </Button>
          <Button type="default" disabled={loading} onClick={handleRegister}>
            {loading ? 'Login...' : 'Register'}
          </Button>
        </Space>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </Form>
    </div>
  );
};

export default Login;
