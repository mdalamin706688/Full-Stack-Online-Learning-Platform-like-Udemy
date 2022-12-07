import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Context } from '../context'
import { useRouter } from 'next/router'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  //state
  const { state, dispatch } = useContext(Context)
  const{user} = state 

  //router
  const router = useRouter()

  useEffect(() => {
    if(user != null) router.push("/")
  }, [user])

  //console.log("TESTING ENV", process.env.NEXT_PUBLIC_API);

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setLoading(true)
      const { data } = await axios.post(`/api/login`, {
        email,
        password
      })
      //console.log("Login Response", data);
      dispatch({
        type: 'LOGIN',
        payload: data
      })
      toast.success('Login Sucessful')
      //setLoading(false)

      //save in local storage
      window.localStorage.setItem('user', JSON.stringify(data))

      //redirect
      router.push('/')
    } catch (err) {
      toast.error(err.response.data)
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className='jumbotron bg-primary text-center square'>Login</h1>

      <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            className='form-control mb-4 p-4'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Enter email'
            required
          />

          <input
            type='password'
            className='form-control mb-4 p-4'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Enter password'
            required
          />

          <button
            type='submit'
            className='btn btn-primary btn-block bcss'
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>

        <p className='text-center p-3'>
          Not yet registered? <Link href='/register'>Register</Link>
        </p>
      </div>
    </>
  )
}

export default Login
