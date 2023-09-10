import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async ({request}) => {
  // get hold on the query params to diff. b/w login & signup data.
  // with request object we can get hold of the data submitted in the form element of router-dom
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  if( mode !== 'login' & mode !== 'signup') {
    return json({message: 'Unsupported mode.'}, {status: 422});
  }
  // inbuilt browser constructor to get hold on url
  const data = await request.formData();
  // console.log(data)

  const authData = {
    email: data.get('email'),
    password: data.get('password')
  };

  const response = await fetch('http://localhost:8080/'+ mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  });

  if(response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok){
    throw json ({ message: 'Could not authenticate user.'}, {status: 500});
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem('token', token);

  return redirect('/');

}