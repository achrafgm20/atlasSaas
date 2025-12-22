import {  z } from "zod"
import { Button } from "./ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field"
import { Input } from "./ui/input"
import { Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { useNavigate } from "react-router-dom";



const formShema = z.object({
  rule: z.enum(["Buyer", "Seller"], "Select a role"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type FormValues =z.infer<typeof formShema>

function FormCreate() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formShema),
    defaultValues: {
      rule: "Buyer",
      name: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data: FormValues) {
    try{
        const response = await fetch('http://localhost:4000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if(!response.ok){
            throw new Error('Failed to register user');
        }else{
            const result = await response.json();
            console.log('User registered successfully:', result);
        }
    }catch(error){
        console.error('Error registering user:', error);
    }
    form.reset();
    console.log(data);
    
  }
  return (
    <div className='flex min-h-screen flex-row  justify-center items-center p-6 space-y-6'>
      
        <div className='w-full max-w-lg p-6  border  shadow-sm    rounded-2xl'>  
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldLegend className="text-3xl font-bold mb-4 text-center">Create an Account</FieldLegend>
                <FieldDescription>
                    Already have an account? <a href="#" className="text-blue-500 hover:underline font-bold" onClick={() => navigate('/login')}>Log in</a> 
                </FieldDescription>
                <FieldGroup>
                  <Controller
                    name="rule"
                    control={form.control}
                    defaultValue="Buyer"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="rule">
                          Select your role
                        </FieldLabel>
                      <div className="flex w-full justify-center gap-2">
                        <button className={field.value === "Buyer" ? "border-blue-400 border-3 cursor-pointer rounded-xl text-blue-400 font-bold px-16 py-2 " : "border-gray-300 cursor-pointer border-3 rounded-xl text-black font-bold px-16 py-2 "} type="button" onClick={() => field.onChange("Buyer")}>
                          Buyer
                        </button>
                        <button className={field.value === "Seller" ? "border-blue-400 border-3 cursor-pointer  rounded-xl text-blue-400 font-bold px-16 py-2 " : "border-gray-300 cursor-pointer border-3 rounded-xl text-black font-bold px-16 py-2 "} type="button" onClick={() => field.onChange("Seller")}>
                          Seller
                        </button>
                      </div>
                      </Field>
                    )}
                     />
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) =>( <Field>
                          <FieldLabel htmlFor="name">
                            Full Name
                          </FieldLabel>
                          <Input
                            id="name"
                            {...field}
                            type="text"
                            placeholder="Entre your full name"
                            required
                          />
                          {fieldState.invalid && (<p className="text-sm mt-1 text-red-600">{fieldState.error?.message}</p>)}
                      </Field>)}
                  />
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
                </Field>)}
              />
                </FieldGroup>
              </FieldSet>
               <Field className=" mt-8" orientation="horizontal">
                  <Button className="w-full cursor-pointer" type="submit">Create an account</Button>
                </Field>
            </form>
            
        </div>
        
    </div>
  )
}

export default FormCreate



