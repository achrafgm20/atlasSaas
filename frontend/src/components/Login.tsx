import { z } from 'zod'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field';
import { Controller, useForm } from 'react-hook-form';

import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { useState } from 'react';
import { UseAuth } from '../context/AuthContext';



const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type loginFormValues = z.infer<typeof formSchema>;

function Login() {
  const navigate = useNavigate();
  const [error , setError] = useState<string | null>(null);
  const { login } = UseAuth();
  

  async function onSubmit(values: loginFormValues){
    try{
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if(!response.ok){
        setError('Failed to login');
        throw new Error('Failed to login');
      }else{
        const result = await response.json();
        console.log('User logged in successfully:', result);
        
        // Extract user and token from response and update AuthContext
        const user = result.user || result;
        const token = result.token || result.access_token;
        login(user, token);
         if(user.role === 'Admin'){
          navigate('/admin/dashboard');
        }else if (user.role === 'Seller'){
          navigate('/dashboard/sales');
        }else{
          navigate('/')
        }
        setError(null);
        
       
      }
    }catch(error){
      console.error('Error logging in:', error);
    }
   console.log(values); 
   


}

  const form = useForm<loginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  return (
    <div className='flex w-full flex-row  justify-center items-center p-6 space-y-6'>
        <div className='w-auto max-w-4xl p-6  border  shadow-sm    rounded-2xl'>  
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldLegend className="text-3xl font-bold mb-4 text-center">Login with email , password</FieldLegend>
                <FieldDescription>
                    If you don t have an account go  <a href="#" className="text-blue-500 hover:underline font-bold" onClick={()=> navigate('/regiter')}>Create account</a> 
                </FieldDescription>
                <FieldGroup>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) =>(
                      <Field>
                        <FieldLabel htmlFor="email">
                          Email address
                        </FieldLabel>
                        <Input
                        {...field}
                          id="email"
                          type="email"
                          placeholder="Entre your email"
                          required
                        />
                        {fieldState.invalid && (<p className="text-sm mt-1 text-red-600">{fieldState.error?.message}</p>)}
              </Field>
                    )}
              />
              <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) =>(
                <Field>
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Entre your password"
                    required
                  />
                  {fieldState.invalid && (<p className="text-sm mt-1 text-red-600">{fieldState.error?.message}</p>)}
                  {error && (<p className="text-sm mt-1 text-red-600">{error}</p>)}
                </Field>)}
              />
                </FieldGroup>
              </FieldSet>
               <Field className=" mt-8" orientation="horizontal">
                  <Button className="w-full cursor-pointer" type="submit">Log in</Button>
                </Field>
            </form>
            
        </div>
        
    </div>
  )
}

export default Login