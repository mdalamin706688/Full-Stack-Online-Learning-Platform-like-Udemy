import { useState, useEffect, useContext } from 'react'
import { Button, Menu } from 'antd'
import Link from 'next/link'
import {
  AppstoreOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import { Context } from '../context'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const TopNav = () => {
  const [current, setCurrent] = useState('')

  const { state, dispatch } = useContext(Context)
  const { user } = state

  const router = useRouter()

  useEffect(() => {
    //console.log(window.location.pathname)
    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('user')
    const { data } = await axios.get('/api/logout')
    toast(data.message)
    router.push('/login')
  }

  const items = [
    {
      label: <Link href='/'>App</Link>,
      key: '/',
      icon: <AppstoreOutlined />
    },
    {
      label: <Link href='/login'>Login</Link>,
      key: '/login',
      icon: <LoginOutlined />
    },
    {
      label: <Link href='/register'>Register</Link>,
      key: '/register',
      icon: <UserAddOutlined />
    }
  ]

  const logouts = [
    {
      label: user && user.name,
      icon: <UserAddOutlined />,
      children: [{ label: <a className='logout' onClick={logout}>Logout</a>,icon: <LogoutOutlined /> }]
    }
  ]

  return (
    <div>
      {user === null && (
        <Menu
          selectedKeys={[current]}
          onClick={e => setCurrent(e.key)}
          className='menu float-left'
          mode='horizontal'
          items={items}
        />
      )}

      {user !== null && (
        <Menu
          selectedKeys={[current]}
          className='logout'
          mode='horizontal'
          items={logouts}
        />
      )}
    </div>
  )
}

export default TopNav
